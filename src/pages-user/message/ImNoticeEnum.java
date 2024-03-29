package com.gftech.ms.enums;

/**
 * 标题：系统消息通知类型
 * 描述：
 * 类名：NoticeEnum
 * 时间：2020-6-10 15:49
 *
 * @author chenjianbo
 */
public enum ImNoticeEnum {

    /**
     * 全局类别
     */
    ALL_01("密码设置", "个人", "设置密码、忘记密码、重置密码，修改新密码成功后"),
    ALL_02("绑定手机号", "个人", "手机号绑定"),
    ALL_03("换绑手机号", "个人", "手机号更换成功"),
    ALL_04("实名认证", "个人", "需要实名认证但是没有实名认证的账号，每次登录成功后提醒"),
    ALL_05("实名认证", "个人", "实名认证成功"),
    ALL_06("资质认证", "个人", "需要资质认证但是没有资质认证的账号，每次登录成功后提醒"),
    ALL_07("资质认证", "个人", "资质认证，审核通过触发"),
    ALL_08("资质认证", "个人", "资质认证，审核驳回触发"),
    ALL_09("微信绑定", "个人", "账号绑定微信号操作成功"),
    ALL_10("微信解绑", "个人", "账号解绑微信号操作成功"),

    /**
     * 用户端
     */
    USER_01("支付提醒", "个人", "患者提交订单后，未支付，订单离自动关闭还有10分钟的时候发送付款提醒"),
    USER_02("付款成功", "个人", "患者支付成功之后提醒"),
    USER_03("退款提醒", "个人", "在线咨询（图文）、在线复诊（图文）订单超过接诊时间自动关闭，慢病续方订单被驳回后订单自动关闭时"),
    USER_04("订单审核", "个人", "慢病续方订单审核操作后（驳回/通过）"),
    USER_05("视频邀请", "个人", "在线复诊视频业务，医生向患者发起视频通话时，系统发送给患者的提醒"),
    USER_06("处方提醒", "个人", "在线复诊、慢病续方业务，医生为患者开的处方通审方通过后，系统发送给患者的提醒"),
    USER_07("诊断提醒", "个人", "在线复诊、慢病续方业务，医生为患者写的新诊断，单独提交后，系统发送给患者的提醒"),
    USER_08("诊断提醒", "个人", "在线复诊、慢病续方业务，医生为患者写的已提交过的诊断修改并单独提交后，系统发送给患者的提醒"),
    USER_09("病历提醒", "个人", "在线复诊、慢病续方业务，医生为患者写的新病历第一次提交后，系统发送给患者的提醒"),
    USER_10("病历提醒", "个人", "在线复诊、慢病续方业务，医生为患者写的已提交的病历修改并提交后，系统发送给患者的提醒"),
    USER_11("发货提醒", "个人", "已支付的处方订单，配送方式为邮寄，药房已确认发货，则系统发送给患者提醒"),
    USER_12("提货提醒", "个人", "已支付的处方订单，配送方式为自提，到了预约的自提开始时间，则系统发送给患者提醒"),
    USER_13("提货提醒", "个人", "已支付的处方订单，配送方式为自提，核销成功，则系统发送给患者提醒"),
    USER_14("预约提醒", "个人", "已购买的在线复诊视频业务，到了预约的复诊时间，还没有开始复诊，则系统发送给患者提醒"),
    USER_15("接诊提醒", "个人", "已购买的业务，医生已接诊，则系统发送给患者提醒"),
    USER_16("授权提醒", "个人", "医生申请查看患者的就诊记录/档案，则系统发送给患者提醒"),
    USER_17("处置提醒", "个人", "处置单作废/撤回时，系统发送给患者"),
    USER_18("付款成功", "个人", "处置单在患者支付成功之后提醒"),
    USER_19("退款提醒", "个人", "处置单在患者退款成功之后提醒"),
    USER_20("医生提醒", "个人", "医生PC端患者管理功能，医生推送之后提醒患者"),
    USER_21("处置提醒", "个人", "医生PC端手动点击预约取消,则系统发送给患者提醒"),
    USER_22("用药提醒", "个人", "患者设置的用药提醒，开启状态的每条到了时间点触发"),
    USER_23("预约成功提醒", "个人", "当预约时间选择后，提交成功，患者会收到提醒"),
    USER_24("预约变更提醒", "个人", "当预约时间等信息变更成功后，患者会收到提醒"),
    USER_231("预约成功提醒", "个人", "当预约时间选择后，提交成功，患者会收到提醒"),//医技专用
    USER_241("预约变更提醒", "个人", "当预约时间等信息变更成功后，患者会收到提醒"),//医技专用
    USER_251("取消/停诊通知", "个人", "取消通知/停诊通知,患者会收到提醒"),//医技专用
    /**
     * 医生端
     */
    DOCTOR_01("新的订单","个人","患者已下单并付款的服务订单，会向对应的医生推送系统消息"),
    DOCTOR_02("审核提醒","个人","患者已下单并付款的慢病续方服务订单处于待审核状态，并且离自动驳回还有10分钟的时候触发，会向对应的医生推送系统消息"),
    DOCTOR_03("诊断提醒","个人","慢病续方，在线复诊：当诊室在接诊中状态停留超过8小时，还没有提交诊断，则自动触发提醒，并且每30分钟提醒一次，直到提交了诊断为止。"),
    DOCTOR_04("病历提醒","个人","在线复诊：当诊室在接诊中状态停留超过8小时，还没有提交病历，则自动触发提醒，并且每30分钟提醒一次，直到提交了病历为止。"),
    DOCTOR_05("退订提醒","个人","在线咨询、在线复诊的图文类别服务订单，状态为待接诊，在订单自动关闭前1小时触发。"),
    DOCTOR_06("退订提醒","个人","在线咨询、在线复诊的图文类别服务订单，状态为待接诊，在订单自动关闭后触发。"),
    DOCTOR_07("处方提醒","个人","在线复诊、慢病续方：诊室没有已通过处方、有处方草稿还未提交、有待审核处方，则在截止开处方功能前1小时，触发提醒。"),
    DOCTOR_08("处方提醒","个人","在线复诊、慢病续方：诊室没有已通过处方、有处方草稿还未提交、有待审核处方，则在停止开处方功能后，触发提醒。"),
    DOCTOR_09("处方审核","个人","在线复诊、慢病续方：药师对该处方审核通过/驳回后，触发。"),
    DOCTOR_10("接诊提醒","个人","1.在线视频复诊：当患者到了预约时间，还没有接诊，则开始提醒医生。根据设置的时段，1/5时段提醒一次，直到接诊为止。"),
    DOCTOR_11("接诊提醒","个人","2.在线咨询（图文）、在线复诊（图文）：待接诊状态，根据业务设置的待接诊的服务订单自动关闭倒计时时长，1/5时段提醒一次，直到接诊/退款为止。"),
    DOCTOR_12("授权提醒", "个人", "医生申请查看患者的就诊记录/档案被拒绝、同意时，触发系统给医生发送提醒"),

    /**
     * 药师
     */
    YS_01("处方审核", "药房", "在线复诊、慢病续方：有新的处方被医生提交过来，在提交成功的那一刻触发。"),
    YS_02("处方审核", "药房", "在线复诊、慢病续方：处方离自动驳回还有1/5时段的那一刻触发，触发后每次登录账号都会触发一次。"),
    YS_03("处方审核", "药房", "在线复诊、慢病续方：处方已自动驳回。"),
    YS_04("处方审核", "药房", "在线复诊、慢病续方：处方还未审核，还有1小时该处方关联的医生诊室开处方功能将停止时，触发提醒。"),
    YS_05("处方审核", "药房", "在线复诊、慢病续方：处方还未审核，但该处方关联的医生诊室开处方功能已停止，触发提醒。"),

    /**
     * 药房
     */
    YF_01("新的订单", "药房", "患者已下单并付款的处方订单，会向对应的接收方药房推送系统消息。"),
    YF_02("发货提醒", "药房", "患者已下单并付款的处方订单（邮寄），72小时后还未发货，会向对应的接收方药房推送系统消息，触发后每次登录账号都会触发一次，直到发货为止。"),
    YF_03("发货提醒", "药房", "一笔处方订单，状态从待发货变为待收货时触发。"),
    YF_04("提货提醒", "药房", "患者已下单并付款的处方订单（自提），超过预约时段24小时后还未自提，会向对应的接收方药房推送系统消息，触发后每次登录账号都会触发一次，直到提货为止。"),
    YF_05("提货提醒", "药房", "一笔待自提的处方订单，核销成功时触发。"),
    YF_06("低库存预警", "药房", "当某个药品可用库存大于0，小于等于设置的低库存临界值时触发，后面每次登录账号都会触发一次，直至该药品可用库存数量大于低库存临界值为止。"),
    YF_07("低库存预警", "药房", "当某个药品可用库存等于0时触发，后面每次登录账号都会触发一次，直至该药品可用库存数量大于0为止。"),

    /**
     * 机构
     */
    ORG_01("审核提醒", "机构", "当有员工提交了资质认证申请时，触发提醒。"),
    ORG_02("审核提醒", "机构", "当有员工提交的资质认证申请，超过24小时未处理时，触发提醒，后面每次账号登录提醒一次，直至处理为止。"),
    ORG_03("公告提醒", "个人", "公告发布成功。"),


    /**
     * 掌医部分 全局类别
     */
    ZY_USER_01("医生停诊通知", "个人",""),
    ZY_USER_02("明日就诊提醒", "个人",""),
    ZY_USER_03("报告发布提醒", "个人",""),
    ZY_USER_04("押金补缴提醒", "个人",""),
    ZY_USER_05("体检报告提醒", "个人",""),
    ZY_USER_06("费用清单推送提醒", "个人",""),
    ZY_USER_07("住院建档成功通知", "个人",""),
    ZY_USER_08("住院支付成功通知", "个人",""),
    ZY_USER_09("住院支付失败通知", "个人",""),
    ZY_USER_10("门诊叫号提醒", "个人",""),
    ZY_USER_11("门诊缴费提醒", "个人",""),
    ZY_USER_12("门诊缴费成功通知", "个人",""),
    ZY_USER_13("门诊缴费失败通知", "个人",""),
    ZY_USER_14("改单提醒", "个人",""),
    ZY_USER_15("预约取号提醒", "个人",""),
    ZY_USER_16("挂号成功通知", "个人",""),
    ZY_USER_17("预约取消通知", "个人",""),
    ZY_USER_18("预约支付成功通知", "个人",""),
    ZY_USER_19("预约取消退款通知", "个人",""),
    ZY_USER_20("门诊缴费退款通知", "个人",""),
    ZY_USER_21("住院押金退款通知", "个人",""),
    ZY_USER_22("体检支付失败通知", "个人",""),
    ZY_USER_23("体检预约成功通知", "个人",""),
    ZY_USER_24("体检缴费成功通知", "个人",""),
    ZY_USER_25("体检缴费退款通知", "个人",""),
    ZY_USER_26("意见反馈", "个人",""),


    /**
     * 公众号
     */
    ZY_MP_01("停诊通知", "个人",""),
    ZY_MP_02("明日就诊提醒", "个人",""),
    ZY_MP_03("报告发布提醒", "个人",""),
    ZY_MP_04("押金补缴提醒", "个人",""),
    ZY_MP_05("体检报告提醒", "个人",""),


    /**
     * 短信
     */
    zy_SMS_01("停诊通知", "机构",""),
    zy_SMS_02("明日就诊提醒", "机构",""),

    ;

    ImNoticeEnum(String title, String client, String remark) {
        this.title = title;
        this.client = client;
        this.remark = remark;
    }



    /**
     * 系统消息标题
     */
    private String title;

    /**
     * 使用类型
     */
    private String client;

    /**
     * 系统消息使用场景描述
     */
    private String remark;

    public String getTitle() {
        return title;
    }

    public String getClient() {
        return client;
    }

    public String getRemark() {
        return remark;
    }
}
