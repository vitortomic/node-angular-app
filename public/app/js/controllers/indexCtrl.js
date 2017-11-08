app.controller('indexCtrl', function ($scope, usersService, $http, transactionService, $filter, senderService, $mdDialog) {
    
    var setRecepient = function(){
        var sender = senderService.getSender();
        $scope.transaction.fromAccount = sender.name + " - " + "$" + sender.amount;
    }

    $scope.initializeForm = function(){
        $scope.transaction = {};
        setRecepient();
        if($scope.submitForm){
            $scope.submitForm.$setUntouched();
        }   
    }
    
    $scope.initializeForm();

    transactionService.getTransactions().then(function(transactions){
        console.log(transactions);
        $scope.sortType = 'transactionDate';
        $scope.sortReverse = true;
        /*in order for search by date string to work we need to add the formated string to the
            to the elements
        */
        transactions.forEach(function(element){
            element.dateString = $filter('date')(element.transactionDate, 'MMM. dd')
        })
        $scope.transactions = transactions;
    })

   $scope.getCategoryColor = function(transaction){
       return '{\'border-left\' : \'6px solid ' + transaction.categoryCode + '\'}';
   }

   $scope.submit = function(){
      $scope.transactionForSubmit = {
          amount: $scope.transaction.amount,
          categoryCode: "#fbbb1b",
          merchant: $scope.transaction.toAccount,
          merchantLogo: "",
          transactionDate: new Date().getTime(),
          transactionType: "Online Transfer"
      }
      confirmTransaction();
   }

   var confirmTransaction = function() {
    var confirm = $mdDialog.confirm()
          .title('Submit transaction confirmation')
          .textContent('Are you sure you want to send $' + $scope.transactionForSubmit.amount + ' to ' + $scope.transactionForSubmit.merchant + '?')
          .ariaLabel('Lucky day')
          .ok('Transfer')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      createTransaction();
      resultAlert({title: "Transaction created", text: "Transaction sucessfully created."});
      $scope.initializeForm();
    }, function() {
      
    });
  };

  var resultAlert = function(message){
      $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title(message.title)
        .textContent(message.text)
        .ariaLabel('Alert Dialog Demo')
        .ok('Close')
    );
  }

  var createTransaction = function(){
      //charges sender for the amount
      senderService.chargeSender($scope.transactionForSubmit.amount);
      //transaction.addTransaction returns transactions with the newly added one
      transactionService.addTransaction($scope.transactionForSubmit).then(function(transactions){
        $scope.transactions = transactions;
      });
  }

});
