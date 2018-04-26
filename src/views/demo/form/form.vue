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
            <Input :disabled="hasSubmit" v-model="from.opinion" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入意见" />
          </FormItem>
          <FormItem label="备注：">
            <Input :disabled="hasSubmit" v-model="from.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
          </FormItem>
          <FormItem label="是否通过：" required>
            <RadioGroup v-model="from.pass" value=0>
              <Radio :disabled="hasSubmit" name="pass" trueValue=0  label="通过"  ></Radio>
              <Radio :disabled="hasSubmit" name="pass" falseValue=1 label="不通过"></Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="">
            <Button :disabled="hasSubmit" @click="handleSubmit" style="width:100px;" type="primary">提交</Button>
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
                title: '表单提交',
                describe: '普通表单提交',
                from: {
                    opinion: '嘻嘻嘻',
                    remark: '呵呵',
                    pass: '通过'
                },
                stepRules: {
                    opinion: [
                        { required: true, message: '请填写意见', trigger: 'blur' }
                    ]
                },
                hasSubmit: false
            };
        },
        methods: {
            handleSubmit () {
                this.$refs['step'].validate((valid) => {
                    if (valid) {
                        this.hasSubmit = true;
                        util.ajax.post('/demo/form', this.from).then(res => {
                            var data = res.data;
                            if (data.ok) {
                                console.log(data);
                                this.$Message.success('提交成功');
                            } else {
                                this.hasSubmit = false;
                                this.$Message.error('提交失败');
                            }
                        });
                    }
                });
            }
        }
    };
</script>
