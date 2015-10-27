//window.zs.step1
;window.zs.step1 = (function step1($, step1, undefined) {
    var o = step1 || {};
    o.LoadServices = function (providerId) {
        window.zs.UpdateStep(0);
        window.zs.Step1.LoadServices(providerId);
    };
    o.UpdateStep = function (stepNumber) {
        $('.zr-steps').show();
        $('.zr-steps li.zr-active').removeClass('zr-active');
        $($('.zr-steps li').get(stepNumber)).addClass('zr-active');
    };
    
    o.HideStep = function (){
        $('.zr-steps').hide();
    };

    return o;
})(window.zs.jQuery || $, window.zs.step1 || {});

//window.zs.step1
 window.zs.step2 = (function step2($, step2, undefined) {
    var calendarSelector = "a[date]";
    var bookingLinkSelector = "#book";
    var selectedInfo = "#selectedInfo";
    var serviceName = "#serviceName";
    var resourceSelector = "a[rkey]";
    var timeSelector = "a[time]";
    var calendarContainerSelector = '._DayToBook';
    var serviceId = 'input[name="serviceId"]';
    var providerId = 'input[name="providerId"]';
    var serviceType = 'input[name="serviceType"]';
    var resourceId = 'input[name="resourceId"]';
    var selectedResourceId = '.selected>a[rkey]';
    var o = step2 || {};
    o.selectedTime = null;
    o.dayId = null;
    o.ticks = null;
    o.direction = null;
    o.resourceId = null;
    o.providerId = null;
    o.updateCalendar = function (e) {
        var link = $(e.currentTarget);
        $(calendarSelector).parent('li').removeClass('selected');
        $(link).parent('li').addClass('selected');
        o.dayId = $(link).attr('date');
        o.ticks = $(link).attr('ticks');
        o.resourceId = $(selectedResourceId).attr('rkey');
        o.providerId = $(providerId).val();
        zs.GetDayToBookByDayId(calendarContainerSelector, o.getParams());
    };
    o.updateResource = function (e) {
        var link = $(e.currentTarget);
        $(resourceSelector).parent('li').removeClass('selected');
        $(link).parent('li').addClass('selected');
        o.dayId = $('li[class="selected"] > a[date]').attr('date');
        o.resourceId = $(link).attr('rkey');
        o.providerId = $(providerId).val();;
        zs.GetDayToBookByDayId(calendarContainerSelector, o.getParams());
        o.updateTime();

    };

    o.setSelectedInfo = function (){
//        var text = 'Выбрано: ';
//        text += $('#serviceName').text();
//        text += ', ' + $('li[class=selected]>a[rkey]').text();
//        text +=', ' + $('li[class=selected]>a[date]').text();
//        text += ', ' + $('li[class=selected]>a[time]').text();
//
//        $(selectedInfo).text(text);
    };

    o.checkSelection = function () {
        o.resourceId = $('li[class=selected]>a[rkey]').attr('rkey');
        o.selectedTime = $('li[class=selected]>a[time]').attr('time');
        o.providerId = $(providerId).val();
        o.serviceType = $(serviceType).val();

        if (o.serviceType == 'BookingByDays') {
            o.dayId = o.selectedTime;

            if (o.dayId != null && o.resourceId != null && o.selectedTime != null) {
                $(bookingLinkSelector).show();
                o.setSelectedInfo();
                $(selectedInfo).show();
                return true;
            }
        } else {
            o.dayId = $('li[class=selected]>a[date]').attr('date');
            if (o.dayId != null && o.resourceId != null && o.selectedTime != null) {
                $(bookingLinkSelector).show();
                o.setSelectedInfo();
                $(selectedInfo).show();
                return true;
            }
        }
        $(bookingLinkSelector).hide();
        $(selectedInfo).hide();
        return true;
    };
    o.getParams = function () {
        var res = {};
        for (var key in o) {
            if (o.hasOwnProperty(key) && (!$.isFunction(o[key]))) {
                res[key] = o[key];
            }
        }
        res.serviceId = $(serviceId).val();;
        return (res);
    };
    o.sendSelection = function () {
        if (o.checkSelection()) {
            var p = {stepNumber:3, serviceId: $(serviceId).val(), resourceId: o.resourceId, providerId: o.providerId, selectedTime: o.selectedTime, dayId: o.dayId, useMaster:true };
            window.zs.LoadStep(p);
        }
    };
    o.updateScrollCalendar = function (e) {
        var link = $(e.currentTarget);
        var scrollCalendarContainer = $('._ScrollCalendar');
        var p = {};
        p.direction = 1;
        if ($(link).attr('data') === "prev") {
            p.direction = 0;
        }
        p.ticks = $(link).attr("ticks");
        zs.GetScrollCalendar(scrollCalendarContainer, p);
    };
    o.updateTime = function (e) {
        if (e) {
            var link = $(e.currentTarget);
            if ($(link).parent('li').hasClass('zr-lock')) return;
            $(timeSelector).parent('li').removeClass('selected');
            $(link).parent('li').addClass('selected');
            o.selectedTime = link.attr('time');
        }
        else {
            $('.zr-time-select li').removeClass('selected');
        }
    };
    o.bindClick = function (){
        window.zs.step1.UpdateStep(1);
        $('a', calendarSelector, resourceSelector, timeSelector, bookingLinkSelector).off('click');
        $(calendarSelector).off('click');
        $(resourceSelector).off('click');
        $(timeSelector).off('click');
        $(bookingLinkSelector).off('click');
        $('a').off('click');
        $('a[data="prev"],a[data="next"]').off('click');
        $(calendarSelector).on('click', o.updateCalendar);
        $(resourceSelector).on('click', o.updateResource);
        $(timeSelector).on('click', o.updateTime);
        $(bookingLinkSelector).one('click', o.sendSelection);
        $('a').on('click', o.checkSelection);
        $('a[data="prev"],a[data="next"]').on('click', o.updateScrollCalendar);
    };

    $(o.bindClick());
    return o;
})(window.zs.jQuery || $, window.zs.step2 || {});

//window.zs.step3
window.zs.step3 = (function step3($, step3, undefined) {
    var o = step3 || {};
    var zakazSel = o.zakazSel = '.zr-zakaz';
    var clientNameSel = o.clientNameSel = 'input[wparam="Name"]';
    var serviceId = o.serviceId = 'input[name="serviceId"]';
    var providerId = o.providerId = 'input[name="providerId"]';
    var sessionId = o.sessionId = 'input[name="sessionId"]';
    var resourceId = o.resourceId = 'input[name="resourceId"]';
    var startDateTicks = o.startDateTicks = 'input[name="startDateTicks"]';
    var clientPhoneSel = o.clientPhoneSel = 'input[wparam="Phone"]';
    var clientCommentSel = o.clientCommentSel = 'textarea[wparam="Comment"]';
    var clientEmailSel = o.clientEmailSel = 'input[wparam="Email"]';
    var clientRemindHoursSel = o.clientRemindHoursSel = 'select[wparam="RemindHours"]';
    var clientEmailCheckBoxSel = o.clientEmailCheckBoxSel = 'input[wparam="IsEmailSpecified"]';
    var phoneVerificationCodeSel = o.phoneVerificationCodeSel = 'input[wparam="PhoneVerificationCode"]';
    var submitCodeButtonSel = o.submitCodeButtonSel = '.submitCodeButton';
    var phoneMask = '+375-(99)-999-99-99';
    function BuildParams() {
        var p = {
            serviceId: $(serviceId).val(),
            providerId: $(providerId).val(),
            resourceId: $(resourceId).val(),
            startDateTicks: $(startDateTicks).val(),
            clientName: $(clientNameSel).val(),
            clientPhone: $(clientPhoneSel).val(),
            comment: $(clientCommentSel).val(),
            email: $(clientEmailSel).val(),
            isEmailSpecified: $(clientEmailCheckBoxSel).is(":checked"),
            remindHours: $(clientRemindHoursSel).val(),
            sessionId: $(sessionId).val(),
            phoneVerificationCode: $(phoneVerificationCodeSel).val()
        };
        
        var result = {};
        var $inputs = $('.zr-dict-fields :input');
        $inputs.each(function () {
            
            var item = this;
            if (result[item.name] != undefined && (result[item.name] == 'false' || result[item.name] == 'true')) {
                result[item.name] = true; // it can be only checkbox.
            } else {
                result[item.name] = $(item).val();
            }
        });

        $inputs = $('.zr-dict-fields :checkbox');
        $inputs.each(function () {
            var item = this;
            result[item.name] = $(item).is(':checked');
        });

        p.CustomFieldValuesForRequestValues = JSON.stringify(result);

        return p;
    }
    

    o.IsEmailOn = function () {
        if ($(clientEmailCheckBoxSel).is(":checked")) {
            $(clientEmailSel).show();
        }
        else {
            $(clientEmailSel).hide();
        }
        
    };
    o.sendRequest = function () {
        window.zs.Step4Save(o.getParams());
       
    };
    o.getParams = function () {
        return BuildParams();
    };

    o.SendVerificationCode = function (){
        $(submitCodeButtonSel).hide();
        zs.widgetSuccessMsg('Проверочный код выслан на указанный номер. Пожалуйста, подождите ответа и введите код.');
        $.when(window.zs.SendVerificationCode(o.getParams()))
        .then(setTimeout(function () {
            $(submitCodeButtonSel).show();
        }, 15000));
    };
    o.bindClick = function () {
        $(zakazSel).off('click').on('click', o.sendRequest);
        $(clientEmailCheckBoxSel).off('click').on('click', o.IsEmailOn);
        $(submitCodeButtonSel).off('click').on('click', o.SendVerificationCode);
    };
    o.init = function (){
        $(zakazSel).show();
//        $(clientPhoneSel).mask(phoneMask);
        window.zs.step1.UpdateStep(2);
        o.bindClick();
    };
    return o;
})(window.zs.jQuery || $, window.zs.step3 || {});
