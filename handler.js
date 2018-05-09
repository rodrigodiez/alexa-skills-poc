module.exports.statement = (event, context, callback) => {

    require('https').get('https://mobile-api-awal-gw-demo.kobaltapi.com/statements/S1', (res) => {
        res.setEncoding('utf8');
        res.on('data', function (body) {
            bodyJson = JSON.parse(body)
            let response


            if(event.request.type == "IntentRequest") {
                switch(event.request.intent.name) {
                    case "StatementBalanceIntent":
                        response = {
                            version: "1.0",
                            response: {
                                outputSpeech: {
                                    type: "SSML",
                                    ssml: "<speak>Your last statement's balance is <emphasis>£" + bodyJson['data'][0]['attributes']['amount'] + "</emphasis>. It comprises royalties from <say-as interpret-as='date'>" + bodyJson['data'][0]['attributes']['periodStart'] + "</say-as> to <say-as interpret-as='date'>" + bodyJson['data'][0]['attributes']['periodEnd'] + "</say-as></speak>"
                                },
                                shouldEndSession: false
                            }
                        };
                        break;
                    case "StatementMetricsReportIntent":
                        let artists = bodyJson.included.filter(function(item){
                            return item.type == "topArtistItem"
                        });
                        let territories = bodyJson.included.filter(function(item){
                            return item.type == "topTerritoryItem"
                        });

                        response = {
                            version: "1.0",
                            response: {
                                outputSpeech: {
                                    type: "SSML",
                                    ssml: "<speak><p>The artist that generated more royalties is <emphasis>" + artists[0].attributes.name + "</emphasis> with <emphasis>£" + artists[0].attributes.amount  + "</emphasis>.</p> <p><emphasis>" + territories[0].attributes.name + "</emphasis> is the country with highest revenue with <emphasis>£" + territories[0].attributes.amount + "</emphasis> in royalties. Although I think you should invest more in Spain</p></speak>"
                                },
                                shouldEndSession: false
                            }
                        };
                        break;
                        case "ThanksIntent":

                            response = {
                                version: "1.0",
                                response: {
                                    outputSpeech: {
                                        type: "SSML",
                                        ssml: "<speak>You are welcome!</speak>"
                                    },
                                    shouldEndSession: true
                                }
                            };
                            break;
                    default:
                        response = {
                            version: "1.0",
                            response: {
                                outputSpeech: {
                                    type: "SSML",
                                    ssml: "<speak>Sorry, I don't understand</speak>"
                                },
                                shouldEndSession: false
                            }
                        };
                }
            }

            callback(null, response);
        });
    });
};
