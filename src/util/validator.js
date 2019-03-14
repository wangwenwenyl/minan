
//身份证校验
export function validatorIdQq(rules,value,callback){
    const regIdQq=/^[0-9]*$/;
    if (value && !regIdQq.test(value)) {
        callback('只输入数字');
    }
    callback();
}
//身份证校验
export function validatorIdNumber(rules,value,callback){
    const regIdNumber=/(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(!value){
        callback('内容不能为空')
    }else if (value && !regIdNumber.test(value)) {
        callback('身份证输入不合法');
    }
    callback();
}
//一般账户=》车主姓名
export function validatorCarOwnerName (rules,value,callback) {
    if(!value){
        callback('车主姓名不能为空');
    }else{
    const regNames=/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/;
    if(value && !regNames.test(value)){
        callback('不超过50位、中英文、区分大小写');
    }
}
    callback();
}
//一般账户》身份证校验
export function validatorIdNumberSpecial(rules,value,callback){
    const regIdNumber=/(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(!value){
        callback('内容不能为空')
    }else if (value && !regIdNumber.test(value)) {
        callback('18位，数字（最后一位可有X）');
    }
    callback();
}
//一般账户》》电话号码

export function validatorMobileSpecial (rules,value,callback){
    const regMobile=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!value){
           callback('内容不能为空')
    }else if(value && !regMobile.test(value)){
        callback('11位、数字');
    }
    callback();
}
//电话号码校验
export function validatorMobile (rules,value,callback){
    const regMobile=/^[1][3,4,5,7,8][0-9]{9}$/;
    if(!value){
           callback('内容不能为空')
    }else if(value && !regMobile.test(value)){
        callback('手机号码格式不正确');
    }
    callback();
}
//标签名字
export function validatorLabelName (rules,value,callback) {
    if(!value){
        callback('名字不能为空');
    }else{
         const regLabelName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{1,12}$/;
    if(value && !regLabelName.test(value)){
        callback('不超过12位、区分大小写');
    }
    }
   
    callback();
}
//联系电话格式校验
export function validatorPhone (rules,value,callback) {
    const regPhone=/^0\d{2,3}-?\d{7,8}$|^[1][3,4,5,7,8][0-9]{9}$/;
    if(value && !regPhone.test(value)){
        callback('电话号码格式不正确');
    }
    callback();
}
//用户管理-邮箱格式验证
export function validatoeEmail(rules,value,callback){
    const regEmail= /^[A-Za-z0-9\u4e00-\u9fa5-_]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if((value == null) || (value == '') || (value && regEmail.test(value))){
        callback();
        return; 
    }
    callback('E-mail格式不正确');
}
//用户管理=》用户账号校验
export function validatorName (rules,value,callback) {
   if(!value){
       callback('用户账号不能为空')
   }else{
       const regName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{4,20}$/;
    if(value && !regName.test(value)){
        callback('4-20位数字/英文/中文/符号');
    }
   }
    
    callback();
}
//通知推送管理=》消息标题名称
export function validatorNewsName (rules,value,callback) {
    if(!value){
        callback('该项为必填项，请重新输入')
    }else{
        const regName=/^[a-zA-Z0-9\u4e00-\u9fa5]{1,}$/;
        const regName1=/^.{1,30}$/;
     if(value && !regName.test(value)){
         callback('输入格式错误，请重新输入');
     }
     if(value && !regName1.test(value)){
        callback('不超过30位字符');
    }
    }
     
     callback();
 }
//角色管理=》角色名称
export function validatorRoleName (rules,value,callback) {
    if(!value){
        callback('角色名称不能为空')
    }else{
        const regName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{1,20}$/;
     if(value && !regName.test(value)){
         callback('1-20位数字/英文/中文/符号');
     }
    }
     
     callback();
 }
//用户》》//联系电话校验
export function validatorUserPhone (rules,value,callback) {
    if(!value){
        callback('电话不能为空');
    }else{
    const regPhone=/^0\d{2,3}-?\d{7,8}$|^[1][3,4,5,7,8][0-9]{9}$/;
    if(value && !regPhone.test(value)){
        callback('电话号码格式不正确');
    }
}
    callback();
}
//用户管理=》用户姓名
export function validatorUserNames (rules,value,callback) {
    if(!value){
        callback('用户名不能为空');
    }else{
    const regNames=/^[a-zA-Z0-9]{12,12}$/;
    if(value && !regNames.test(value)){
        callback('必须为12个英文/数字');
    }
}
    callback();
}
//用户管理=》用户姓名
export function validatorNames (rules,value,callback) {
    if(!value){
        callback('用户名不能为空');
    }else{
    const regNames=/^[a-zA-Z\u4e00-\u9fa5]{1,10}$/;
    if(value && !regNames.test(value)){
        callback('不超过10个英文/中文');
    }
}
    callback();
}
//参数管理》参数名称
export function validatorParameter (rules,value,callback) {
    if(!value){
        callback('所在单位不能为空');

    }else{
    const regCompanyName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{1,20}$/;
    if(!regCompanyName.test(value)){
        callback('不超过20个数字/英文/中文/符号');
    }
}
    callback();
}
//参数管理》参数单位
export function validatorParameterUnit (rules,value,callback) {
    
    const regCompanyName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{0,10}$/;
    if(!regCompanyName.test(value)){
        callback('不超过10个数字/英文/中文/符号');
    }

    callback();
}
//参数管理》备注
export function validatordesc (rules,value,callback) {
    
    const regCompanyName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{0,300}$/;
    if(!regCompanyName.test(value)){
        callback('不超过300个数字/英文/中文/符号');
    }

    callback();
}
//角色管理》备注
export function validatordesc1 (rules,value,callback) {
    
    const regCompanyName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{0,300}$/;
    if(!regCompanyName.test(value)){
        callback('不超过300个数字/英文/中文/符号');
    }

    callback();
}
//转发管理 》接收方名称
export function validatorReceiver (rules,value,callback) {
    if(!value){
        callback('接收方名称不能为空');

    }else{
    const regCompanyName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{1,100}$/;
    if(!regCompanyName.test(value)){
        callback('不超过100个数字/英文/中文/符号');
    }
}
    callback();
}
//转发管理 》端口名称
export function validatorPort (rules,value,callback) {
    if(!value){
        callback('端口不能为空');

    }else{
    const regCompanyName=/^[0-9]{1,6}$/;
    if(!regCompanyName.test(value)){
        callback('不超过6位，只能输入数字');
    }
}
    callback();
}
//转发管理=》地址校验
export function validatorAddress (rules,value,callback) {
    if(!value){
        callback('转发地址不能为空');

    }else{
        const regPasswordInfo=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{1,100}$/;
        if( !regPasswordInfo.test(value)){
            callback('不超过100个字符');
        }
    }
    
    callback();
}
//转发管理=》密码
export function validatorPasswordForward (rules,value,callback) {
    if(!value){
        callback('密码不能为空');
    }else{
        const regPasswordInfo=/(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{20,20}$/;
        if( !regPasswordInfo.test(value)){
            callback('20个数字/英/符号组合(至少两种)');
        }
    }
    
    callback();
}
//账户管理=》密码校验
export function validatorPasswordInfo (rules,value,callback) {
    if(!value){
        callback('密码不能为空');
    }else{
        const regPasswordInfo=/(?!^\d+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)(?!^.*[\u4E00-\u9FA5].*$)^\S{6,16}$/;
        if( !regPasswordInfo.test(value)){
            callback('6-16个数字/英/符号组合(至少两种)');
        }
    }
    
    callback();
}
//用户管理》单位名称
export function companyName (rules,value,callback) {
    if(!value){
        callback('所在单位不能为空');

    }else{
    const regCompanyName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{1,100}$/;
    if(!regCompanyName.test(value)){
        callback('不超过100个数字/英文/中文/符号');
    }
}
    callback();
}
//用户管理=》密码校验
export function validatorPassword (rules,value,callback) {
    const regPassword=/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,16}/;
    if(!value){
        callback('请输入密码');
    }else if(!regPassword.test(value)){
        callback('6-16个数字/英/符号组合(至少两种)');
    }
    callback();
}
//t-box弹窗Sn
export function tboxSn (rules,value,callback) {
    const regSn=/^\S+$/	;
    if(!value || !regSn.test(value)){
        callback('请输入T_BOX SN');
    }
    callback();
}
//T_BOX生产商
export function tboxProducter (rules,value,callback) {
    const regProducter=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{2,20}$/;
    if(!value ||  !regProducter.test(value)){
        callback('2-20个数字/英文/中文/符号');
    }
    callback();
}
//tbox iccid
export function tboxIccid (rules,value,callback) {
    const regIccid=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{20}$/;
    if(!value ||  !regIccid.test(value)){
        callback('20个数字/英文/中文/符号');
    }
    callback();
}
//tbox Sim卡运营商
export function tboxSim (rules,value,callback) {
    const regSim=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{2,20}$/;
    if(!value ||  !regSim.test(value)){
        callback('2-20个数字/英文/中文/符号');
    }
    callback();
}
//去掉空格
export function  keycode (event) {
    if(event.keyCode=='32'){
        event.preventDefault();
        return false;
    }
}
//岗位管理》新建》岗位名称
export function jobName (rules,value,callback) {
    const jobName=/^[a-zA-Z0-9\u4e00-\u9fa5]{2,20}$/;
    if(!value ||  !jobName.test(value)){
        callback('2-20个数字/英文/中文');
    }
    callback();
}
//信息发布》》标题
export function topicName (rules,value,callback) {
    const regName=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{0,30}$/;
    if(value &&  !regName.test(value)){
        callback('不超过30个数字/英文/中文/符号');
    }
    callback();
}
//设备文本
export function deviceText (rules,value,callback) {
    const regIccid=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{0,12}$/;//0-12中英文数字
    if(!value){
        callback('必填项不能为空')
    }else if(!regIccid.test(value)){
        callback('格式输入错误，请重新输入');
    }
    callback();
}
export function deviceText2 (rules,value,callback) {
    const regIccid=/^[a-zA-Z0-9\W_\u4e00-\u9fa5]{0,24}$/;
    if(!value){
        callback('必填项不能为空')
    }else if(!regIccid.test(value)){
        callback('格式输入错误，请重新输入');
    }
    callback();
}
//SIM卡号
export function simNum (rules,value,callback) {
    const reg=/^[0-9]{11}$/;
    if(!value){
        callback('必填项不能为空')
    }else if(!reg.test(value)){
        callback('11位、数字');
    }
    callback();
}
//iccid卡号
export function iccidNum (rules,value,callback) {
    const reg=/^[a-zA-Z0-9]{20}$/;
    if(!value){
        callback('必填项不能为空')
    }else if(!reg.test(value)){
        callback('20位、数字、字母');
    }
    callback();
}
//车辆信息-新增-VIN
export function informSn (rules,value,callback) {
    const informSn=/^[0-9a-zA-Z]{17}$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!informSn.test(value)){
        callback('17位数字/英文');
    } 
    callback();
}
//车辆信息-电机编号，电池编号mes，电控编号，终端sn
export function informTbox (rules,value,callback) {
    const informTbox=/^[a-zA-Z0-9]{1,30}$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!informTbox.test(value)){
        callback('不超过30位数字/英文');
    } 
    callback();
}
//版本号
export function versionCheck (rules,value,callback) {
    const versionCheck=/^[0-9]{1,9}\.[0-9]{1,9}\.[0-9]{1,9}$/;
    if(!value){
        callback('必填项不能为空');
    }else if(!versionCheck.test(value)){
        callback('X.X.X，数字');
    }
    callback();

}
//车辆信息-编辑-发票号码
export function invoice (rules,value,callback) {
    const invoice=/^[0-9]{8}$/;
    console.log(value)
    console.log(!invoice.test(value))
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!invoice.test(value)){
        callback('请输入八位数字');
    } 
    callback();
}
//车辆信息-编辑-购买方名称
export function purchaserName (rules,value,callback) {
    const purchaserName=/^[0-9a-zA-Z\W_\u4e00-\u9fa5]{1,100}$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!purchaserName.test(value)){
        callback('不超过100位中文/英文/数字');
    } 
    callback();
}

//车辆信息-编辑-身份证号或统一编码
export function idcard (rules,value,callback) {
    const idcard=/^[1-9]{1}[0-9]{16}[0-9Xx]$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!idcard.test(value)){
        callback('18位数字或英文加数字');
    } 
    callback();
}
//车辆信息--编辑--价税合计（不超过两位小数）
export function totalValorem (rules,value,callback) {
    const totalValorem=/^(([1-9]{1}\d*)|([1-9]{1}\d))(\.\d{0,2})?$/;
    if(value  &&  !totalValorem.test(value)){
        callback('可输入小数点后两位');
    } 
    callback();
}
//车型管理-添加车型-车型名称---不超过12位中/英文/数字/特殊符号
export function carTypeNames (rules,value,callback) {
    const carTypeNames=/^[0-9a-zA-Z\W_\u4e00-\u9fa5]{1,12}$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if( !carTypeNames.test(value)){
        callback('不超过12位，区分大小写');
    }
    callback();
}
//车型管理-添加型号-公告型号--不超过24位中/英文/数字/特殊符号
export function carNoticeModel (rules,value,callback) {
    const carNoticeModel=/^[0-9a-zA-Z\W_\u4e00-\u9fa5]{1,24}$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!carNoticeModel.test(value)){
        callback('不超过24位，区分大小写');
    }
    callback();
}
//车型管理-添加型号-公告批次---不超过12位整数
export function carNoticeBatch (rules,value,callback) {
    const carNoticeBatch=/^\d{1,12}$/;
    if(!value){
        callback('该项为必填项，请重新输入');
    }else if(!carNoticeBatch.test(value)){
        callback('不超过12位，数字/整数');
    } 
    callback();
}
//车型管理-添加型号-发动机型号
export function engineType (rules,value,callback) {
    const engineType=/^[0-9a-zA-Z\W_\u4e00-\u9fa5]{0,12}$/;
    if(value &&  !engineType.test(value)){
        callback('不超过12位数，区分大小写');
    }
    callback();
}
//车型管理-添加型号-发动排量
export function displacement (rules,value,callback) {
    const displacement=/^[0-9\d+]{0,5}$/;
    if(value && !displacement.test(value)){
        callback('不超过5位，数字/整数');
    }
    callback();
}
//车型管理-添加型号-汽缸数
export function cylinderNumber (rules,value,callback) {
    const cylinderNumber=/^[0-9\d+]{0,2}$/;
    if(value &&  !cylinderNumber.test(value)){
        callback('不超过2位，数字/整数');
    }
    callback();
}
//车型管理-添加型号-最大功率
export function maximumPower (rules,value,callback) {
    const maximumPower=/^[0-9\d+]{0,4}$/;
    if(value &&  !maximumPower.test(value)){
        callback('不超过4位，数字/整数');
    }
    callback();
}

//车型管理-添加型号-续航里程--不超过5位数字支持两位小数
export function extensionMileage (rules,value,callback) {
    const extensionMileage= /(?=^\d*[1-9]\d*$)(^[0-9]{1,5}$)|(^[0-9]{1,5}\.([0-9]{1,2})$)/;
    if(value &&  !extensionMileage.test(value)){
        callback('不超过5位，数字/支持小数');
    }
    callback();
}
//车型管理-添加型号-快充时间/慢充时间/整车质保/电池组质保/综合油耗---不超过2位数字支持两位小数
export function fastChargeTime (rules,value,callback) {
    const fastChargeTime= /(?=^\d*[1-9]\d*$)(^[0-9]{1,2}$)|(^[0-9]{1,2}\.([0-9]{1,2})$)/;
    if(value &&  !fastChargeTime.test(value)){
        callback('不超过2位，数字/支持小数');
    }
    callback();
}
//车型管理-添加型号-快充百分比/电池容量/电机总功率/电机总扭矩/最大扭矩--不超过3位数字支持两位
export function fastPercentage (rules,value,callback) {
    const fastPercentage= /(?=^\d*[1-9]\d*$)(^[0-9]{1,3}$)|(^[0-9]{1,3}\.([0-9]{1,2})$)/;
    if(value &&  !fastPercentage.test(value)){
        callback('小数不超过3位，数字/支持小数');
    }
    callback();
}
//车型管理-车身尺寸
export function dimensions (rules,value,callback) {
    const dimensions= /^[0-9]{1,4}\*[0-9]{1,4}\*[0-9]{1,4}$/;
    if(value &&  !dimensions.test(value)){
        callback('格式错误，请重新输入(长*宽*高，4位，整数)');
    }
    callback();
}