app.controller('pricingCtrl', ['Pricing', 'Utils', '$mdDialog', '$state', '$stateParams', 'UINotification', '$scope',
    function (Pricing, Utils, $mdDialog, $state, $stateParams, UINotification, $scope) {
        var vm = this;
        vm.changeFormat = changeFormat;
        vm.deleteRow = deleteRow;
        vm.saveRow = saveRow;
        vm.createNewRow = createNewRow;
        vm.setZone = setZone;
        vm.selectCountry = selectCountry;
        vm.answer = answer;
        vm.active = active;
        vm.addCountry = addCountry;

        vm.pricingId = $stateParams.id;
        vm.format = $stateParams.format ? $stateParams.format : 'A5';
        vm.pricing = {};
        vm.pricingByFormat = [];
        vm.finish = false;
        vm.test = "";
        vm.ev = {};
        vm.countryList = [];
        vm.deliveryList = [];
        vm.deliveryCodes = [];
        vm.selected = null;
        vm.reverse = null;
        vm.formatList = ['A5', 'NOTEBOOK', 'SOCKS', 'CHOCOLATE']

        getCountries();
        getPricing();
        getPricingByFormat();
        function getCountries() {
            Pricing.getCountries().then(function (res) {
                vm.formatList = res.printer_format;                
                for (a in res.delivery_countries) {
                    vm.countryList.push({ code: a, display_name: res.delivery_countries[a] });
                }
                vm.finish = true;
            });
            Pricing.getDeliveryTime().then(function (res) {
                res.map(function (x, index) {
                    if (x.dispatch_type === "IMMEDIATE") {
                        x.countries.map(function (y) {
                            if (!vm.deliveryList[index]) {
                                vm.deliveryList[index] = [];
                                vm.deliveryCodes[index] = [];
                            }
                            vm.deliveryList[index].push({ code: y.code, display_name: y.display_name });
                            vm.deliveryCodes[index].push(y.code);
                        })
                    }
                })
            });
            vm.finish = true;
        }
        function getPricing() {
            Pricing.getPricing(vm.pricingId).then(function (res) {
                vm.pricing = res;
                if(vm.pricing.expense_type === "DELIVERY"){
                    vm.recipientList = ['all','home_fill', 'direct_send'];
                    vm.recipient_type = vm.recipientList[0];
                }else{
                    vm.recipientList = [];
                    vm.recipient_type = null;
                }
                vm.finish = true;
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
        }
        function getPricingByFormat() {
            Pricing.getPricingByFormat(vm.pricingId, vm.format).then(function (res) {
                vm.pricingByFormat = res;
                vm.finish = true;
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
        }
        function changeFormat(format) {
            $state.go('marketing.pricing', { id: vm.pricingId, format: format })
        }
        function deleteRow(row) {
            var text = "";
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete price?')
                .textContent(text)
                .ariaLabel('Delete price row')
                .targetEvent(row)
                .ok('YES')
                .cancel('NO');
            $mdDialog.show(confirm).then(function () {
                if (row.id) {
                    Pricing.deleteRow(row.id).then(function (res) {
                        if (res[0] === "DELETED") {
                            vm.pricingByFormat.splice(vm.pricingByFormat.indexOf(row), 1);
                        }
                    }).catch(function (err) {
                        UINotification.error(err.data.message);
                    });
                } else { vm.pricingByFormat.splice(vm.pricingByFormat.indexOf(row), 1); }
                UINotification.success("Price row deleted");
            }, function () {
                UINotification.success("You didn't delete this price row");
            });
        }
        function saveRow(row) {
            delete row.top_hash;
            if (row.id) {
                Pricing.saveRow(row).then(function (res) {
                    UINotification.success("Price row saved");
                    row = res;
                }).catch(function (err) {
                    UINotification.error(err.data.message);
                });
            } else {
                saveNewRow(row);
            }
        }
        function saveNewRow(row) {
            Pricing.saveNewRow(row).then(function (res) {
                UINotification.success("New Price row saved");
                row = res;
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
        }
        function createNewRow() {
            if (vm.pricingByFormat.length) {
                var newRow = angular.copy(vm.pricingByFormat[vm.pricingByFormat.length - 1]);
                delete newRow.id;
                if(vm.recipient_type==='home_fill'||vm.recipient_type==='direct_send'){
                    newRow.recipient_type = vm.recipient_type;
                }
                newRow.quantity_range.start = newRow.quantity_range.end + 1;
                newRow.quantity_range.end = newRow.quantity_range.start + 1;
            } else {
                var newRow = {
                    cost_table_id: vm.pricingId,
                    printer: "PROCO",
                    buyer_currency: "GBP",
                    delivery_countries: vm.pricing.expense_type === "DELIVERY" ? [] : ["EARTH"],
                    format: vm.format,
                    price_class: vm.pricing.expense_type === "DELIVERY" ? "NONE" : "STANDARD",
                    recipient_type: vm.pricing.expense_type === "DELIVERY" ? vm.recipient_type: null,
                    quantity_range: { start: 1, end: 3 },
                    price: {
                        type: vm.pricing.price_type
                        , cost: 2.99
                    },
                };
                vm.pricingByFormat = [];
            }
            vm.pricingByFormat.push(newRow);
            console.log(vm.pricingByFormat);
        }
        function setZone(query) {
            var countries = angular.copy(query);

            if (vm.deliveryCodes) {
                var countryZone = "";
                vm.deliveryCodes.map(function (zone, index) {
                    var i = 0;
                    countries.map(function (x) {
                        if (zone.includes(x)) {
                            i++;
                        }
                    });
                    if (i === zone.length) {
                        zone.map(function (x) {
                            countries.splice(countries.indexOf(x), 1);
                        })
                        countryZone += "Zone " + (index + 1) + " ";
                    }
                });
                return countryZone ? countryZone + (countries.length ? '+' + countries.length : '') : countryName(countries);

            }
        }
        function countryName(countries) {
            var names = "";
            countries.map(function (code, index) {
                vm.countryList.map(function (name) {
                    if (name.code === code) {
                        if (index < 2) {
                            names += names ? ', ' + name.display_name : name.display_name;
                        }
                    }
                })
            })
            return countries.length <= 2 ? names : names + ' +' + (countries.length - 2);
        }
        function selectCountry(ev) {
            vm.ev = angular.copy(ev);
            $mdDialog.show({
                controller: function () {
                    return vm;
                },
                controllerAs: 'vm',
                templateUrl: 'tabDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                local: { ev: ev }
            })
                .then(function (answer) {
                    if (answer) {
                        ev.delivery_countries = vm.ev.delivery_countries;
                    }

                }, function () {
                    console.log("Yes");

                });
        }
        function answer(answer) {
            $mdDialog.hide(answer);
        }
        function active(code) {
            if (vm.ev.delivery_countries[0] === 'EARTH') {
                return 'btn-primary';
            }
            if (code.constructor === Array) {
                var allZone = true;
                code.map(function (x) {
                    if (!vm.ev.delivery_countries.includes(x.code)) {
                        allZone = false;
                    }
                })
                return allZone ? 'btn-primary' : '';
            }
            else if (vm.ev.delivery_countries.includes(code.code)) {
                return 'btn-primary';
            }
            return '';

        }
        function addCountry(code) {
            if (code.constructor === Array) {
                if (vm.active(code)) {
                    code.map(function (x) {
                        if (vm.ev.delivery_countries.includes(x.code)) {
                            vm.ev.delivery_countries.splice(vm.ev.delivery_countries.indexOf(x.code), 1);
                        }
                    })
                } else {
                    code.map(function (x) {
                        if (!vm.ev.delivery_countries.includes(x.code)) {
                            vm.ev.delivery_countries.push(x.code);
                        }
                    })
                }
            }
            else {
                if (vm.ev.delivery_countries.includes(code.code)) {
                    vm.ev.delivery_countries.splice(vm.ev.delivery_countries.indexOf(code.code), 1);
                }
                else {
                    vm.ev.delivery_countries.push(code.code);
                }
            }
        }

    }]);