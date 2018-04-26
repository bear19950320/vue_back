<style lang="less">
    @import '../../../styles/common.less';
</style>
<template>
    <div>
        <Row>
            <Card>
                <div class="step-header-con">
                    <h3>{{ title }}</h3>
                    <h5>{{ describe }}</h5>
                </div>
                <Form class="step-form" ref="step" :model="from" :rules="stepRules" :label-width="100">
                    <FormItem label="意见：" prop="opinion">
                        <Input :disabled="hasSubmit" v-model="from.opinion" type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入意见"/>
                    </FormItem>
                    <FormItem label="备注：">
                        <Input :disabled="hasSubmit" v-model="from.remark" type="textarea"
                               :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"/>
                    </FormItem>
                    <FormItem label="是否通过：" required>
                        <RadioGroup v-model="from.pass" value=0>
                            <Radio :disabled="hasSubmit" name="pass" trueValue=0 label="通过"></Radio>
                            <Radio :disabled="hasSubmit" name="pass" falseValue=1 label="不通过"></Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="附件：" prop="file">
                        <Upload multiple
                                v-bind:action="action"
                                :data="module"
                                :on-success="handleSuccess"
                        >
                            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                    </FormItem>
                    <FormItem label="">
                        <Button :disabled="hasSubmit" @click="handleSubmit" style="width:100px;" type="primary">提交
                        </Button>
                    </FormItem>
                </Form>
            </Card>
        </Row>
    </div>
</template>

<script>
    import util from '@/libs/util';

    export default {
        name: 'workflow',
        data () {
            return {
                title: '文件上传',
                describe: '带文件上传的',
                action: util.base + '/File/FileUploadact',
                module: {module: 'temp'},
                from: {
                    opinion: '',
                    remark: '',
                    pass: '不通过',
                    file: ''
                },
                stepRules: {
                    opinion: [
                        {required: true, message: '请填写意见', trigger: 'blur'}
                    ],
                    file: [
                        { required: true, message: '请上传附件', trigger: 'blur' }
                    ]
                },
                hasSubmit: false
            };
        },
        methods: {
            handleSuccess (data, file) {
                if (data.ok) {
                    this.$Notice.success({
                        title: '文件上传成功',
                        desc: '文件 ' + file.name + ' 上传成功。'
                    });
                    this.from.file += data.data + ',';
                } else {
                    this.$Notice.error({
                        title: data.msg,
                        desc: '文件 ' + file.name + ' 上传失败。'
                    });
                }
            },
            handleSubmit () {
                this.$refs['step'].validate((valid) => {
                    if (valid) {
                        this.hasSubmit = true;
                        var formData = {
                            'data.opinion': this.from.opinion,
                            'data.remark': this.from.remark,
                            'data.pass': this.from.pass,
                            'data.file': this.from.file,
                            demoStr: '测试'
                        };
                        util.ajax.post('/demo/upload', formData).then(res => {
                            var data = res.data;
                            if (data.ok) {
                                console.log(data);
                                this.$Message.success('提交成功！');
                            } else {
                                this.hasSubmit = false;
                                this.$Message.error('提交失败！');
                            }
                        });
                    }
                });
            }
        }
    };
</script>
