App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load animals.
    // $.getJSON('../Animals.json', function(data) {
    //   var animalsRow = $('#animalsRow');
    //   var animalsTemplate = $('#animalsTemplate');

    //   for (i = 0; i < data.length; i ++) {
    //     animalsTemplate.find('.panel-title').text(data[i].name);
    //     animalsTemplate.find('img').attr('src', data[i].picture);
    //     animalsTemplate.find('.animals-fee').text(data[i].fee);
    //     animalsTemplate.find('.animals-age').text(data[i].age);
    //     animalsTemplate.find('.animals-location').text(data[i].location);
    //     animalsTemplate.find('.btn-adopt').attr('data-id', data[i].id);

    //     animalsRow.append(animalsTemplate.html());
    //   }
    // });

    // Load transactions.
    $.getJSON('../transactions.json', function(data) {
      var transactionsRow = $('#transactionsRow');
      var transactionsTemplate = $('#transactionsTemplate');

      for (i = 0; i < data.length; i ++) {
        transactionsTemplate.find('td').attr('style', "word-wrap:break-word;padding:5px");
        transactionsTemplate.find('.tx-hash').text(data[i].txhash);
        transactionsTemplate.find('.tx-from').text(data[i].from);
        transactionsTemplate.find('.tx-to').text(data[i].to);
        transactionsTemplate.find('.tx-value').text(data[i].value);

        transactionsRow.append("<tr>"+transactionsTemplate.html()+"</tr>");
      }
    });
    
   
    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {

      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    //App.openSend();

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('SponsorAnimals.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted animals
      //return App.markAdopted();
      //return App.openSend();
    });
    return App.openSend();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleSend);
  },

  openSend: function() {
    console.log("TRIGGER SEND");
    $(document).on('click', '.btn-send', App.handleSend);
  },

  listenSend: function() {
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      const event = adoptionInstance.Transfer(null, {fromBlock: 0}, (err, res) => {
        if(err) {
          throw Error(err)
        }
      })
      event.watch(function(error, result){
        if (error) { return console.log(error) }
        if (!error) {
          // DO ALL YOUR WORK HERE!
          let { args: { from, to, value }, blockNumber } = result
          console.log(`----BlockNumber (${blockNumber})----`)
          console.log(`from = ${from}`)
          console.log(`to = ${to}`)
          console.log(`value = ${value}`)
          console.log(`----BlockNumber (${blockNumber})----`)
        }
      })
    
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-animals').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  writeFile: function(event) {
    var adoptionInstance;

    // App.contracts.Adoption.deployed().then(function(instance) {
    //   adoptionInstance = instance;
    
    //   return adoptionInstance.getAdopters.call();
    // }).then(function(adopters) {
    //   for (i = 0; i < adopters.length; i++) {
    //     if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
    //       $('.panel-animals').eq(i).find('button').text('Success').attr('disabled', true);
    //     }
    //   }
    // }).catch(function(err) {
    //   console.log(err.message);
    // });
        console.log("TRIGGER SEND");
        var transactionsRow = $('#transactionsRow');
        var transactionsTemplate = $('#transactionsTemplate');
        transactionsTemplate.find('td').attr('style', "word-wrap:break-word;padding:5px");
        transactionsTemplate.find('.tx-hash').text("New Transaction");
        transactionsTemplate.find('.tx-from').text("Trex");
        transactionsTemplate.find('.tx-to').text("Akram");
        transactionsTemplate.find('.tx-value').text("5.0 ETH");

        transactionsRow.append("<tr>"+transactionsTemplate.html()+"</tr>");
      

  },

  handleSend: function(event) {
    event.preventDefault();

    var animalId = parseInt($(event.target).data('id'));
    var adoptionInstance;

    // web3.eth.getAccounts(function(error, accounts) {
    // if (error) {
    //   console.log(error);
    // }

    // var account = accounts[0];

    // App.contracts.Adoption.deployed().then(function(instance) {
    //     adoptionInstance = instance;

    //     // Execute adopt as a transaction by sending account
    //     return adoptionInstance.adopt(animalId, {from: account});
    //   }).then(function(result) {
    //     return App.writeFile();
    //   }).catch(function(err) {
    //     console.log(err.message);
    //   });
    // });
    
    
    App.writeFile();
  }

};

$(function() {
  $(window).load(function() {
    App.init();
    
    //$(document).on('click', '.btn-send', App.writeFile());
  });
});
