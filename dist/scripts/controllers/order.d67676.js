'use strict';
app.controller('orderCtrl', ['$scope', '$rootScope', '$filter', 'Order', 'Email', 'Utils', 'CardVariation', 'Cards', 'Profile', 'Pricing', 'UINotification', '$mdDialog', '$q', '$state', '$stateParams',
    function ($scope, $rootScope, $filter, Order, Email, Utils, CardVariation, Cards, Profile, Pricing, UINotification, $mdDialog, $q, $state, $stateParams) {
        var vm = this;
        vm.orderId = $stateParams.orderId;
        vm.changeIcon = changeIcon;
        vm.changeColor = changeColor;
        vm.editAddress = editAddress;
        vm.setDelivery = setDelivery;
        vm.reprintOrder = reprintOrder;
        vm.sentToPrinter = sentToPrinter;
        vm.changeMessage = changeMessage;
        vm.messageEditor = messageEditor;
        vm.refundDialog = refundDialog;
        vm.refundRequest = refundRequest;
        vm.closeDialog = closeDialog;
        vm.delivered = delivered;
        vm.stopOrder = stopOrder;
        vm.multiOrders = multiOrders;
        vm.device = device;
        vm.getSample = getSample;
        vm.getProcoInfo = getProcoInfo;
        vm.getInerBack = getInerBack;
        vm.arrivalDate = arrivalDate;
        vm.setToDate = setToDate;
        vm.dateFilter = dateFilter;
        vm.approveCard = approveCard;
        vm.sendEmail = sendEmail;
        vm.root = $rootScope;
        vm.copyText = copyText;
        vm.statusType = statusType;
        vm.editDate = editDate;
        vm.getStatusDate = getStatusDate;
        vm.daysInPost = daysInPost;
        vm.changeOption = changeOption;
        vm.noOfCards = noOfCards;
        vm.dayOfWeek = dayOfWeek;
        vm.greetingMessage = greetingMessage;
        vm.editCardsItem = editCardsItem;
        vm.updateItemOption = updateItemOption;
        vm.setItemOptions = setItemOptions;
        vm.editItemOption = editItemOption;
        vm.dispatchDate = dispatchDate;
        vm.toTitleCase = Utils.toTitleCase;
        vm.resendEmail = resendEmail;
        vm.multi = {};
        vm.order = {};
        vm.buyer = {};
        vm.sample = {};
        vm.feedback = 1;
        vm.loadingSample = false;
        vm.editorAddress = false;
        vm.editMessage = false;
        vm.open = false;
        vm.fonts = ["Blue", "Green", "Amati"];
        vm.isStandard = true;
        vm.screensImage = "isStandard";
        vm.orderReason = 'lost';
        vm.emailOptions = [
            { query: "isStandard", title: "Standard" },
            { query: "isAddress", title: "Incorrect Address" },
            { query: "isOccasion", title: "Missed Occasion" },
            { query: "isLate", title: "Late Request" },
            { query: "isThreeDays", title: "Under 3 Days" },
            { query: "isUnderMaxDay", title: "Under Max Delivery Date" }];
        vm.replyOption = 'replyCredit';
        vm.replyOptions = [
            { query: "replyCredit", title: "Give Credit" },
            { query: "replyReprint", title: "Reprint Order" },
            { query: "replyRefund", title: "Refund Order" }];
        vm.returnOption = 1;
        vm.returnOptions = [
            { query: "Addressee gone away", title: "it seems the addressee no longer lives at the address given?" },
            { query: "No such address", title: "it seems that the address is incorrect?" },
            { query: "No PO Box number", title: "it seems that the address is missing a PO Box Number?" },
            { query: "Incomplete Address", title: "it seems that the address is incomplete?" },
            { query: "Not known at this address", title: "it seems the addressee is not known at this address?" },
            { query: "Not called for?", title: "it seems that the item was not collected from the Royal Mail within the given time period?" },
            { query: "Moved away", title: "it seems the recipient no longer lives at the address given?" },
            { query: "Unclear", title: "it’s not clear exactly what this was though?" },];
        vm.today = new Date().getDay();
        init();
        function init(){
            getOrder();
            getSettings();
        }
        function getSettings(){
            CardVariation.getSettings().then(function (res) {
                vm.variation = res.card_variations;
            })
            Pricing.getHolidays().then(function(res){
                vm.holidays = res;
            })
        }
        function commonAddress() {
            var isSame = 0;
            if (vm.multi.orders) {
                vm.multi.orders.map(function (order) {
                    var sameAddress = true;
                    for (var key in order.delivery_address) {

                        if (order.delivery_address[key] != vm.order.delivery_address[key]) {
                            sameAddress = false;
                        }
                    }
                    if (sameAddress) {
                        isSame++;
                    }
                })
            }
            vm.hasCommonAddress = isSame;
        }
        function greetingMessage() {
            var today = new Date();
            var day = today.getDay();
            var hours = today.getHours();
            if (day >= 5) {
                return 'weekend';
            } else if (day == 0) {
                if (hours >= 17) {
                    return 'evening';
                } else {
                    return 'rest of your weekend';
                }
            } else {
                if (hours >= 17) {
                    return 'evening';
                } else if (hours >= 11) {
                    return 'afternoon';
                } else {
                    return 'morning';
                }
            }

        }
        function changeOption() {
            vm.emailOptions.map(function (x) {
                if (x.query == vm.screensImage) {
                    vm[x.query] = true;
                } else {
                    vm[x.query] = false;
                }
            })
            vm.replyOptions.map(function (x) {
                if (x.query == vm.replyOption) {
                    vm[x.query] = true;
                } else {
                    vm[x.query] = false;
                }
            })
        }
        function dayOfWeek(dayIndex) {
            return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
        }
        function dateAndTime() {
            var today = new Date();
            var day = today.getDay();
            var hours = today.getHours();
            var minutes = today.getMinutes();
            if (day == 0 || day >= 5) {
                if (day == 5 && (hours < 16 || hours == 16 && minutes < 29)) {
                    vm.dispatchDay = day;
                } else {
                    vm.dispatchDay = 1;
                    vm.isWeekend = true;
                }
            } else {
                if (hours > 16 || hours == 16 && minutes > 29) {
                    vm.dispatchDay = day + 1;
                } else {
                    vm.dispatchDay = day;
                }
            }
            if (hours == 16 && minutes < 30) {
                vm.changeTime = true;
            } else {
                vm.changeTime = false;
            }
        }
        function noOfCards() {
            var quanity = 0;
            vm.order.cards.map(function (x) {
                quanity += x.quantity;
            })
            return quanity;
        }
        function copyText(element) {
            var el = document.getElementById(element);
            var range = document.createRange();
            var sel = document.getSelection();
            range.selectNode(el)
            sel.removeAllRanges();
            sel.addRange(range);
            document.execCommand("copy");
        }
        function daysInPost() {
            if (vm.order.status_changes) {
                var list = vm.order.status_changes;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].status == "SENT") {

                        var today = new Date();
                        var days = Math.floor((today.getTime() - editDate(list[i].created)) / (1000 * 60 * 60 * 24));
                        return days ? days : 1;
                    }
                }
            }


        }
        function statusType(status) {
            var list = ['PAID', 'SENT_TO_PRINTER', 'PRINTING', 'SENT'];
            return (list.indexOf(status) > -1);
        }
        function getStatusDate(status) {
            if (vm.order.status_changes) {
                var list = vm.order.status_changes;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].status == status) {
                        if (status == 'PAID') {
                            vm.orderMadeDay = new Date(list[i].created);
                            if(vm.orderMadeDay.getDay()==6){//if Saturday
                                vm.nextOrderDispatch ='on Monday';
                            }else if(vm.orderMadeDay.getDay()==vm.today){//if 
                                vm.nextOrderDispatch = 'tomorrow';
                            }else{
                                vm.nextOrderDispatch = 'today';
                            }
                        }
                        var date = editDate(list[i].created);
                        var day = $filter('date')(date, "d");
                        if ((day[1] && day[1] == '1' && day[0] != '1') || (!day[1] && day[0] == '1')) {
                            day += 'st';
                        }
                        else if ((day[1] && day[1] == '2' && day[0] != '1') || (!day[1] && day[0] == '2')) {
                            day += 'nd';
                        }
                        else if ((day[1] && day[1] == '3' && day[0] != '1') || (!day[1] && day[0] == '3')) {
                            day += 'rd';
                        }
                        else {
                            day += 'th';
                        }
                        var month = $filter('date')(list[i].created, "MMMM");
                        return day + '  of ' + month;
                    }
                }
            }
        }
        function editDate(dt) {
            var date = new Date(dt);
            var nextDay = false;
            if (date.getHours() >= 20) {
                if (date.getHours() == 20) {
                    if (date.getMinutes() > 30) {
                        date = new Date(date.getTime() + (1000 * 60 * 60 * 24));
                        nextDay = true;
                    }
                } else {
                    date = new Date(date.getTime() + (1000 * 60 * 60 * 24));
                    nextDay = true;
                }
            }
            var day = date.getDay();
            day = day > 5 ? 8 - day : 0;
            if (day || nextDay) {
                var dispatch = new Date(new Date(date.getTime() + day * 1000 * 60 * 60 * 24).toISOString().slice(0, 10));
                return (dispatch.getTime() + 60 * 60 * 15 * 1000);
            }
            else {
                return dt;
            }
        }
        function getOrder(){
            Order.get(vm.orderId).then(function (res) {
                vm.order = res;
                vm.date = new Date(vm.order.order_delivery.estimated_earliest_arrival_date);
                console.log("Order", res);

                bestArrivaldate();
                getCreator();
                if (res.multi_address_order_id) {
                    getMultiAddressOrder();
                    getOrderEmails(res.multi_address_order_id);
                }
                if (vm.order.status === "UNFIT_FOR_PRINT") {
                    vm.order.cards.map(function (x) {
                        getCard(x);
                    })
                }
            }).catch(function (err) {
                console.log("Profile not found");
            })

        }
        function getOrderEmails(id){
            Email.getOrderEmails(id).then(function(res){
                vm.emails = res;
            })
        }
        function resendEmail(email){
            Email.resendEmail(vm.orderId,email.email_type).then(function(res){
            UINotification.success("New Email Sent");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
          }
        function getMultiAddressOrder() {
            Order.multiAddressOrder(vm.order.multi_address_order_id).then(function (res) {
                vm.multi = res;
            })
        }
        function getCreator() {
            Profile.get(vm.order.buyer_id).then(function (res) {
                vm.buyer = res;
                console.log("Buyer", res);
            }).catch(function (err) {
                console.log("Profile not found");
            })
        }
        function getCard(card) {
            Cards.get(card.card_id).then(function (res) {
                card.moderation = res.moderation;
            })
        }
        function bestArrivaldate() {
            Order.getBestArrivalDate(vm.order.delivery_address.country_code).then(function (res) {
                vm.bestArrivaldate = res.estimated_latest_arrival_date;
            });
        }
        function approveCard(card) {
            vm.loadingSample = true;
            Cards.approveCard(card, 'PRIVATE').then(function (res) {
                card.moderation = res.moderation;
                vm.loadingSample = false;
                UINotification.success("Card Updated");
            }).catch(function (err) {
                vm.loadingSample = false;
                UINotification.error(err.data.message);
            })
        }
        function changeIcon(query) {
            switch (query) {
                case "UNPAID":
                    return "fa glyphicon-transfer text-danger"
                case "UNDELIVERED":
                    return "fa fa-envelope text-danger";
                case "UNFIT_FOR_PRINT":
                    return "fa fa-photo text-danger";
                case "PRINTING_ERROR":
                    return "fa fa-close text-danger";
                case "PAID":
                    return "fa fa-money text-success";
                case "DELIVERED":
                    return "fa fa-envelope text-success";
                case "SENT_TO_PRINTER":
                    return "fa fa-send text-success";
                case "SENT":
                    return "fa fa-check text-success";
                case "PRINTING":
                    return "fa fa-print text-primary";
                case "REQUIRES_REFUND":
                    return "fa fa-mail-reply text-warning";
                case "REFUNDED":
                    return "fa fa-check text-warning";
                default:
                    return "fa fa-cogs text-warning";
            }
        }
        function changeColor(query, type) {
            switch (query) {
                case "UNPAID":
                case "PRINTING_ERROR":
                case "UNFIT_FOR_PRINT":
                case "UNDELIVERED":
                    return type + "-danger";
                case "PAID":
                case "SENT_TO_PRINTER":
                case "SENT":
                case "DELIVERED":
                    return type + "-success";
                case "PRINTING":
                    return type + "-primary"
                default:
                    return type + "-warning";
            }
        }
        function editAddress() {
            if (vm.editorAddress) {
                Order.get(vm.orderId).then(function (res) {
                    vm.order = res;
                })
            }
            vm.editorAddress = !vm.editorAddress
        }
        function setDelivery() {
            Order.setDelivery(vm.orderId, vm.order.delivery_address, vm.date, vm.order.recipient_type).then(function (res) {
                vm.order = res;
                UINotification.success("Delivery Update");
                vm.editorAddress = false;
            }).catch(function (err) {
                if (err.data.code === "INVALID_ARRIVAL_DATE") {
                    vm.date = new Date(vm.bestArrivaldate);
                    UINotification.error(err.data.message);
                } else {
                    UINotification.error(err.data.message);
                }
            })
        }
        function reprintOrder() {
            Order.reprint(vm.orderId).then(function (res) {
                vm.order = res;
                UINotification.success("Reprinting order");
            }).catch(function (err) {
                UINotification.error("Reprint order faild");
            })
        }
        function sentToPrinter() {
            Order.sentToPrinter(vm.orderId).then(function (res) {
                vm.order = res;
                UINotification.success("Sending to printer");
            }).catch(function (err) {
                UINotification.error("Faild to sent to printer");
            })
        }
        function changeMessage(card, text) {
            card.selected = !card.selected;
            text.text = document.getElementsByTagName('textarea')[0].value;
            Order.changeMessage(vm.orderId, card.id, text).then(function (res) {
                vm.order = res;
                UINotification.success("Message updated");
            }).catch(function (err) {
                UINotification.error("Faild to edit");
            })
        }
        function messageEditor(card) {
            if(card.selected){
                Order.get(vm.orderId).then(function (res) {
                    vm.order = res;
                })
            }else{
                vm.order.cards.map(function(x,index){
                    if(x.id!=card.id&&x.selected){
                        x.selected = undefined;
                        Order.get(vm.orderId).then(function (res) {
                            vm.order.cards[index] = res.cards[index];
                        })
                    }else{
                        card.selected = true;
                    }
                })
            }
        }
        function refundDialog() {
            vm.stripeReason = "duplicate";
            vm.thortfulReason = "";
            $mdDialog.show({
                template:
                    '<md-dialog aria-label="Test">' +
                    '<div layout-padding layout="column">' +
                    '<md-title class="h3">Please enter the refund reasons</md-title>' +
                    '<md-input-container>' +
                    '<label>Stripe reason</label>' +
                    '<md-select ng-model="vm.stripeReason">' +
                    '<md-option value="duplicate">Duplicate</md-option>' +
                    '<md-option value="fraudulent">Fraudulent</md-option>' +
                    '<md-option value="requested_by_customer">Requested by customer</md-option>' +
                    '</md-select>' +
                    '</md-input-container>' +
                    '<md-input-container class="md-block">' +
                    '<textarea placeholder="Thortful reason" ng-model="vm.thortfulReason" rows="2" md-select-on-focus></textarea>' +
                    '</md-input-container>' +
                    '<p class="text-right">' +
                    '<button ng-click="vm.refundRequest()" class="btn btn-primary">Save</button>  ' +
                    '<button ng-click="vm.closeDialog()" class="btn btn-default">Cancel</button>' +
                    '</p>' +
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
            })
        }
        function refundRequest() {
            Order.refund(vm.orderId, vm.stripeReason, vm.thortfulReason).then(function (res) {
                vm.order = res;
                UINotification.success("Refund request sent");
            }).catch(function (err) {
                UINotification.error("Refund request fail");
            })
            vm.closeDialog();
        }
        function closeDialog() {
            $mdDialog.cancel();
        }
        function delivered(deliver) {
            Order.markAsDelivered(vm.orderId, deliver).then(function (res) {
                console.log(res);
                vm.order = res;
                UINotification.success("Status Updated");

            }).catch(function (err) {
                UINotification.error("Update failed");
            })
        }
        function stopOrder() {
            Order.stopOrder(vm.orderId).then(function (res) {
                console.log(res);
                vm.order = res;
                UINotification.success("Order is Stopped");

            }).catch(function (err) {
                UINotification.error("You can't stop the order right now");
            })
        }
        function device(query) {
            if (query >= 1200) {
                return 'desktop-large';
            }
            else if (query < 1200 && query >= 992) {
                return 'desktop';
            }
            else if (query < 992 && query >= 769) {
                return 'tablet';
            }
            else if (query < 769 && query >= 576) {
                return 'mobile-large';
            }
            else if (query < 576) {
                return 'mobile';
            }
        }
        function getSample() {
            if (vm.open) {
                vm.open = false;
            } else {
                vm.loadingSample = true;
                Order.getSample(vm.orderId).then(function (res) {
                    vm.sample = res;
                    vm.open = true;
                    vm.loadingSample = false;
                    console.log(res);
                }).catch(function (err) {
                    vm.loadingSample = false;
                })
            }
        }
        function getProcoInfo() {
            Order.getSample(vm.orderId).then(function (res) {
                procoDialog(res);
                console.log(res);
            }).catch(function (err) {
                UINotification.error(err.data.message);
            })
        }
        function procoDialog(proco) {
            vm.proco = proco;
            $mdDialog.show({
                template:
                    '<md-dialog aria-label="Test">' +
                    '<div layout-padding layout="column">' +
                    '<md-title class="h3">order_id : {{vm.proco.order_id}}</md-title>' +
                    '<md-title class="h4">recipient_type : {{vm.proco.recipient_type}}</md-title>' +
                    '<md-tabs md-dynamic-height md-border-bottom md-swipe-content>' +
                    '<md-tab label="shipping_address">' +
                    '<md-content>' +
                    '<div class="col-sm-12" ng-repeat="(key2,item2) in vm.proco.shipping_address">{{key2+" : "+item2}}</div>' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="order_options">' +
                    '<md-content>' +
                    '<div class="col-sm-12" ng-repeat="(key2,item2) in vm.proco.order_options">{{key2+" : "+item2}}</div>' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="{{\'card \'+($index-(-1))}}" ng-repeat="item in vm.proco.items">' +
                    '<md-content>' +
                    '<div class="col-sm-3" ng-repeat="(key,item2) in item" ng-if="key===\'back\'||key===\'front\'||key===\'inner_back\'||key===\'inner_front\'">' +
                    '<p>{{key+(item2.type?", type: "+item2.type:"")}}</p>' +
                    '<img ng-if="key!==\'back\'" ng-src="{{item2.image_url}}" class="img-responsive">' +
                    '<md-button ng-if="key===\'back\'" class="md-raised md-primary" ng-src="{{item2.image_url}}" >Donwload pdf</md-button>' +
                    '</div>' +
                    '<div class="col-sm-12">' +
                    '<p ng-repeat="(key,item2) in item" ng-if="key!=\'back\'&&key!=\'front\'&&key!=\'inner_back\'&&key!=\'inner_front\'">' +
                    '<span>{{key+" : "+vm.stringify(item2)}}</span>' +
                    '</p>' +
                    '</div>' +
                    '</md-content>' +
                    '</md-tab>' +
                    '</md-tabs>' +
                    '<p class="text-right">' +
                    '<button ng-click="vm.closeDialog()" class="btn btn-default">OK</button>' +
                    '</p>' +
                    '</div>' +
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
            })
        }
        vm.stringify = function (data) {
            return JSON.stringify(data)
        }
        function getInerBack(id) {
            var image = null;
            vm.sample.items.map(function (x) {
                if (x.item_id === id) {
                    if (x.inner_back.image_url) {
                        image = x.inner_back.image_url;
                    }
                    else {
                        image = x.inner_front.image_url;
                    }
                }
            })
            return image;
        }
        function arrivalDate(date) {
            if (date && new Date(date).getTime() < new Date(vm.bestArrivaldate).getTime()) {
                return "text-danger";
            }
        }
        function setToDate(date) {
            if (date) {
                return Date(date);
            } else {
                var a = new Date();
            }
            return a;
        }
        function dateFilter(date) {
            if (date) {
                return date.getTime() + 60 * 60000 >= new Date(vm.bestArrivaldate).getTime();
            }
            return false;
        }
        function cardType() {
            var format = vm.order.cards[0].format;
            if (format && format != "A5") {
                if (format === 'A5_SECRET') {
                    format = 'A5 Secret Message'
                }
                else {
                    var tempFormat = format.split("_");
                    format = '';
                    tempFormat.map(function (x) {
                        format += format ? ' ' + x[0] + x.slice(1).toLowerCase() : x[0] + x.slice(1).toLowerCase();
                    })
                }
                vm.cardFormat = format;
            } else {
                vm.cardFormat = false;
            }
        }
        function sendEmail() {
            if (!vm.deliveryZone) {
                Order.getDeliveryTime().then(function (res) {
                    vm.deliveryZone = {};
                    res.map(function (zone) {
                        if (zone.enabled && zone.dispatch_type) {
                            if (!zone.zone) {
                                zone.countries.map(function (country) {
                                    if (country.code == "GB") {
                                        zone.zone = 1;
                                    }
                                })
                            }
                            zone.countries.map(function (country) {
                                if (country.display_name == vm.order.delivery_address.country) {
                                    vm.deliveryZone.max_days = zone.max_days;
                                    vm.deliveryZone.min_days = zone.min_days;
                                    vm.deliveryZone.zone = zone.zone;
                                }
                            })
                        }
                    })
                    if (daysInPost() < 4&&vm.deliveryZone.zone==1) {
                        vm.screensImage = 'isThreeDays';
                        changeOption();
                    }
                    else if (vm.deliveryZone.zone!=1&&daysInPost() < vm.deliveryZone.max_days) {
                        vm.screensImage = 'isUnderMaxDay';
                        changeOption();
                        internationalPostDays();
                    }
                })
            }
            dateAndTime();
            cardType();
            commonAddress();
            deliveryDays();
            creditOffer();
            changeOption();
            $mdDialog.show({
                template: '<md-dialog ng-cloak aria-label="Test">' +
                    '<div layout-padding layout="column" style="font-family: Helvetica;font-size: 12px;">' +
                    '<md-title class="h3">Email Templates</md-title>' +
                    '<md-tabs md-dynamic-height md-border-bottom md-swipe-content>' +
                    '<md-tab label="Non-Arrival">' +
                    '<md-content ng-include="\'/views/email_temlates/missing_card.3a0742.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Non-Arrival-reply">' +
                    '<md-content ng-include="\'/views/email_temlates/reply.67df1c.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Damaged-Cards">' +
                    '<md-content ng-include="\'/views/email_temlates/damaged_card.4d89cf.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Damaged-Envelope">' +
                    '<md-content ng-include="\'/views/email_temlates/damaged_envelope.0d10b7.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Positive Feedback">' +
                    '<md-content ng-include="\'/views/email_temlates/feedback.9efa69.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Mistake on artwork">' +
                    '<md-content ng-include="\'/views/email_temlates/mistake.4d3917.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Credit Card Fraud">' +
                    '<md-content ng-include="\'/views/email_temlates/fraud.713c98.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Returns from Royal Mail">' +
                    '<md-content ng-include="\'/views/email_temlates/returns.74ad85.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '<md-tab label="Blank Direct">' +
                    '<md-content ng-include="\'/views/email_temlates/blank.1e25ab.html\'">' +
                    '</md-content>' +
                    '</md-tab>' +
                    '</md-tabs>' +
                    '<p class="text-right">' +
                    '<button ng-click="vm.closeDialog()" class="btn btn-default">OK</button>' +
                    '</p>' +
                    '</div>' +
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: true,
            })
        }
        function dispatchDate(status,date){
            if(status=='SENT'){
                var day = new Date(date).getDay();
                if(!day||day>5||isHoliday(date)){//new Date().setHours(0,0,0,0) for holidays.
                    var newDate =  new Date(date).getDate();
                    newDate = new Date(date).setDate(newDate+1);
                    return dispatchDate(status,newDate);
                }
                return date;
            }
            return '';
        }
        function isHoliday(date){//check if the date is holiday
            if(vm.holidays){
                date = new Date(date).setHours(0,0,0,0);
                for(var i = 0; i<vm.holidays.length;i++){
                    if(new Date(vm.holidays[i].date).setHours(0,0,0,0)==date){
                        return true;
                    }
                }
            }
            return false;
        }
        function internationalPostDays(){
            var remainingDays = vm.deliveryZone.max_days-daysInPost();
            if(remainingDays==0){
                vm.estimatedDay = vm.isWeekend?'on Monday':'today';
            }
            if(remainingDays==1){
                vm.estimatedDay = vm.today<5?'tomorrow':'on Monday';
            }
            else{
                vm.estimatedDay = 'within '+remainingDays+' working days';
            }
        }
        function deliveryDays(){
            if(daysInPost()<2){//less than 2 days in post
                vm.firstDelivery = '';
            }
            else if(vm.today){//is not Sunday

                vm.firstDelivery = 'today';
            }else{//is Sunday
                vm.firstDelivery = dayOfWeek(1);

            }
            if(daysInPost()>2){//more than 2 days in post
                vm.nextDelivery = '';
            }
            else if(vm.today!=6){//is not Saturday
                vm.nextDelivery = 'tomorrow';
            }else{//is Saturday
                vm.nextDelivery = dayOfWeek(1);
            }

            if(vm.daysInPost()>1){//more than 2 days in post
                vm.soonestDelivery = '';
            }
            else if(vm.today!=6){//not Saturday
                vm.soonestDelivery =dayOfWeek((vm.today+2)%7);
            }else{
                vm.soonestDelivery =dayOfWeek((vm.today+3)%7)
            }

            if(vm.dispatchDay==vm.today&&vm.changeTime){
                vm.dispatchTime = '5:00pm';
            }
            else{
                vm.dispatchTime = '4:30pm';
            }

            if(vm.isWeekend){
                vm.reDispatchDay = 'on Monday'
                vm.reDeliverDay = 'Tuesday';
                vm.dispatchTime += ' Monday';
            }
            else if(vm.dispatchDay==vm.today){
                vm.reDispatchDay = 'today';
                vm.reDeliverDay = 'tomorrow';
                vm.dispatchTime += ' today';
            }
            else{
                vm.reDispatchDay = 'tomorrow';
                vm.reDeliverDay = dayOfWeek((vm.dispatchDay+1)%7);
                vm.dispatchTime += ' tomorrow';
            }
        }
        function creditOffer(){
            if(vm.noOfCards()>1){//cards more than one
                if(vm.cardFormat){//if is not A5
                    vm.cardCredits = vm.noOfCards()+' free '+vm.cardFormat+' card credits';
                    vm.freeCards =  vm.noOfCards()+' '+vm.cardFormat+' cards (or several A5 cards!)';
                }else{
                    vm.cardCredits = vm.noOfCards()+' free card credits';  
                    vm.freeCards =  vm.noOfCards()+' cards'
                }
            }
            else{
                if(vm.cardFormat){//if is not A5
                    vm.cardCredits = 'a free '+vm.cardFormat+' card credit';
                    vm.freeCards =  vm.cardFormat+' card (or several A5 cards!)';
                }else{
                    vm.cardCredits = 'a free card credit';
                    vm.freeCards =  'card';
                }
            }
        }
        function editCardsItem(card) {
            vm.card = card;
            vm.variation.map(function (x) {
                if (x.format == card.format) {
                    vm.options = x.available_options;
                    vm.options.map(function (y) {
                        if (y.id == vm.card.item_options[0].id) {
                            vm.card.item_options[0] = y;
                        }
                    })
                }
            })
            vm.confirm = false;
            $mdDialog.show({
                template:
                    '<md-dialog>' +
                    '<div layout-padding layout="column">' +
                    '<md-title class="h3">{{vm.card.item_options[0].name}}</md-title>' +
                    '<md-input-container>' +
                    '<label>option</label>' +
                    '<md-select ng-model="vm.card.item_options[0]">' +
                    '<md-option ng-value="option" ng-repeat="option in vm.options">{{option.name}}</md-option>' +
                    '</md-select>' +
                    '</md-input-container>' +
                    '<p class="text-right">' +
                    '<button ng-click="vm.updateItemOption(vm.card)" class="btn btn-primary">Save</button>  ' +
                    '<button ng-click="vm.closeDialog()" class="btn btn-default">Cancel</button>' +
                    '</p>' +
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: true,
                onRemoving: function (event, removePromise) {
                    if (!vm.confirm) {
                        getOrder();
                    }
                }
            })
        }
        function editItemOption(item) {
            vm.item = item;
            vm.confirm = false;
            $mdDialog.show({
                template:
                    '<md-dialog>' +
                    '<div layout-padding layout="column">' +
                    '<md-title class="h3">{{vm.item.name}}</md-title>' +
                    '<md-input-container class="md-block">' +
                    '<input placeholder="Message" ng-model="vm.item.printer_name" md-select-on-focus></textarea>' +
                    '</md-input-container>' +
                    '<p class="text-right">' +
                    '<button ng-click="vm.setItemOptions()" class="btn btn-primary">Save</button>  ' +
                    '<button ng-click="vm.closeDialog()" class="btn btn-default">Cancel</button>' +
                    '</p>' +
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: true,
                onRemoving: function (event, removePromise) {
                    if (!vm.confirm) {
                        getOrder();
                    }
                }
            })
        }
        function updateItemOption(card) {

            Order.updateCardsItemOption(vm.orderId, card).then(function (res) {
                vm.order = res;
                UINotification.success("Card Updated");
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
            vm.confirm = true;
            closeDialog();
        }
        function setItemOptions() {
            Order.setItemOptions(vm.order).then(function (res) {
                vm.order = res;
                UINotification.success("Card Updated");
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
            vm.confirm = true;
            closeDialog();
        }
    }
]);