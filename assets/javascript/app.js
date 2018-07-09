     // Initialize Firebase
     var config = {
        apiKey: "AIzaSyBV6ikwz9p-ljziKMvxFyiGRohOR3I1Oq0",
        authDomain: "trainschedule-550c7.firebaseapp.com",
        databaseURL: "https://trainschedule-550c7.firebaseio.com",
        projectId: "trainschedule-550c7",
        storageBucket: "",
        messagingSenderId: "912644527688"
    };
    firebase.initializeApp(config);

    var dataRef = firebase.database();

    // Initialize Values
    var name = "";
    var destination = "";
    var firstTrain = "";
    var frequency = 0;
    var timeDiff = "";
    var remainder = "";
    var minTilTrain = "";
    var nextTrain = "";
    var nextTrainConv = "";

    $("#submit").on("click", function(event) {
        event.preventDefault();

        name = $("#name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#firstTrain").val().trim();
        frequency = $("#frequency").val().trim();
        firstTrainConv = moment(firstTrain, "HH:mm").subtract(1, "years");
        timeDiff = moment().diff(moment(firstTrainConv), "minutes");
        remainder = timeDiff % frequency;
        minTilTrain = frequency - remainder;
        nextTrain = moment().add(minTilTrain, "minutes");
        nextTrainConv = moment(nextTrain).format("HH:mm");

        dataRef.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            nextTrainConv: nextTrainConv, 
            minTilTrain: minTilTrain,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        $("#name").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");

        return false;

    });
    //Log all items coming out of the snapshot
    dataRef.ref().on("child_added", function(snapshot) {
        console.log(snapshot.val().name);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().firstTrain);
        console.log(snapshot.val().frequency);
        console.log(snapshot.val().dateAdded);


        //List items in the table
        $("#trainData").append("<tr><td id='name-display'> " + snapshot.val().name +
            " </td><td id='destination-display'> " + snapshot.val().destination +
            " </td><td id='frequency-display'> " + snapshot.val().frequency +
            "</td><td>" + snapshot.val().nextTrainConv + 
            "</td><td>" + snapshot.val().minTilTrain + "</td></tr>");
        //Handle any errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });