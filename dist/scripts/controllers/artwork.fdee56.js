app.controller('artworkCtrl', ['Artwork', 'CardVariation', 'UINotification', '$mdDialog', '$state', '$sce', '$stateParams', '$scope',
  function (Artwork, CardVariation, UINotification, $mdDialog, $state, $sce, $stateParams, $scope) {
    var vm = this;

    vm.deleteTemplate = deleteTemplate;
    vm.initPage = initPage;
    //vm.update = update;
    vm.generate = generate;
    vm.updateProduct = updateProduct;
    vm.templateId = $stateParams.templateId;
    vm.printPage = printPage;
    vm.updateElement = updateElement;
    vm.create = create;
    vm.changeCard = changeCard;
    
    vm.template = {};
    vm.html_template = "{{name}}, {{description}}!";
    vm.css_template = "body{background-color: {{color}};}";
    vm.page_width = 0;
    vm.page_height = 0;
    vm.pageSizes = ['A1', 'A2', 'A3', 'A4', 'A5'];
    vm.orientations = ['PORTRAIT', 'LANDSCAPE', 'SQUARE'];
    vm.types =['VAT', 'CARD_BACK', 'CARD_MARKETING'];
    vm.cardOrientations = ['PORTRAIT', 'LANDSCAPE', 'SQUARE'];
    vm.formats = ['SOCKS', 'A5', 'NOTEBOOK'];
    vm.marketing_image_type = ['FORMAT', 'OPTION'];
    vm.marketing_image_size = ['STANDARD', 'THUMB'];
    vm.body = '';
    vm.style = '';
    vm.image='';
    var htmlPage = ''
    var portrait = 'https://d3sqo1r74rjcbz.cloudfront.net/card/5912b4ade4b0b0ad32fca09f/5912b4ade4b0b0ad32fca09f_xlarge.jpg?version=1';
    var landscape ='https://d3sqo1r74rjcbz.cloudfront.net/card/55c9eb52ae1f7fb84cda5f07/55c9eb52ae1f7fb84cda5f07_xlarge.jpg?version=1';
    var firstPart ='';
    var bodyPart ='';
    var stylePart ='';
    var lastPart = '';
    var metaElement = '';
    var element = {};
    var elementHtml = {};

    init();

    function init() {
      Artwork.get(vm.templateId).then(function(res){
        vm.template = res;
        getFormat();
        changeCard();
        initPage();
      }).catch(function(err){
        console.log("Error loading template with",err);
      })
    }
    function initPage(){
      splitHtml(vm.template.html_template);
      showPage(vm.template.html_template);
      
    }
    function splitHtml(page){
      firstPart = page.split('<div')[0];
      lastPart = page.split('}')[page.split('}').length-1];

      vm.body = vm.template.html_template.split('<style>')[0];
      vm.style = '<style>'+vm.template.html_template.split('<style>')[1];
    }
    function showPage(page){
      page = vm.template.html_template.split("{{card-image}}").join(vm.image);
      page = page.replace(firstPart,'<html>');
      vm.page=$sce.trustAsHtml(page);
    }
    function changeCard(){
      if(vm.template.card_orientation==="PORTRAIT"){
        vm.image = portrait;
      }
      else{
        vm.image = landscape;
      }
    }
    function printPage(){
      updateElement();
      updateProduct();
    }
    function updateElement(){
      vm.template.html_template = vm.body + vm.style;
      //changeProperties();
      initPage();
    }
    function updateProduct(){   
      vm.template.dimensions[0]={height: vm.template.page_height, width: vm.template.page_width, unit: "PIXELS"};
      Artwork.update(vm.template).then(function(res){
        vm.template = res;
        initPage();
        UINotification.success("Image updated");
      }).catch(function(err){
        UINotification.error(err.message);
      })
    }
    function generate() {
      Artwork.generateTemplate(vm.template).then(function(res){
        console.log("Sucess with ",res)
      }).catch(function(err){
        console.log("error with ",err);
      })
    }
    function getFormat(){
      CardVariation.getSettings().then(function(res){
        vm.formats = res.printer_format;
      })
    }
    function deleteTemplate() {
      Artwork.deleteTemplate(vm.templateId).then(function (res) {
        console.log("Done", res);
      }).catch(function (err) {
        console.log("Error", err);
      })
    }

     function create() {
      var newTemplate = angular.copy(vm.template);
      delete  newTemplate.id;
      newTemplate.name = 'Copy of '+newTemplate.name;
      Artwork.create(newTemplate).then(function (res) {
        UINotification.success('New Template Created');        
        $state.go('cards.image',{templateId: res.id});
      }).catch(function (err) {
        UINotification.error(err.message);
      })
    }

  }
]);