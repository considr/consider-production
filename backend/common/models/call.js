'use strict';

module.exports = function(Call) {

	var app = require('../../server/server');
	
	Call.addCallToCampaignWithResult = function(campaign_id, constituency_code, parliamentarian_id, call_completed, call_result, call_starts, cb) {
		
		var Campaign = app.models.Campaign;	
		var Parliamentarian = app.models.Parliamentarian;	
		var Constituency = app.models.Constituency;
		
		Campaign.findOne({where: {id: campaign_id}}, function(err, campaign) {
			
			Parliamentarian.findOne({where: {id: parliamentarian_id}}, function(err, parliamentarian) {
					
				Constituency.findOne({where: {constituency_code: constituency_code}}, function(err, constituency) {
						  
					if(campaign != null && parliamentarian != null && constituency != null)
					{	
						var new_call = {
							"call_completed": call_completed,
							"call_result": call_result,
							"call_starts": call_starts,
							"call_ends": Date.now()
						};
				
						Call.create(new_call, function(err, call) {
						  
						  if (err) {
							  
							  cb(null, "Couldn't create Call with data provided");
						  }
						  else
						  {
							  call.from_campaign.add(campaign.id); 
							  call.to_parliamentarian.add(parliamentarian.id); 
							  call.participant_constituency.add(constituency.id); 
								
							  cb(null, call);
						  }

						});
					}	  
						  
				});
				
		    });
						
		}); 	
    }
	
	Call.remoteMethod('addCallToCampaignWithResult', {
          accepts: [
				 {arg: 'campaign_id', type: 'string', required: true},
				 {arg: 'constituency_code', type: 'string', required: true},
				 {arg: 'parliamentarian_id', type: 'string', required: true},
				 {arg: 'call_completed', type: 'boolean', required: true},
				 {arg: 'call_result', type: 'string', required: true},
				 {arg: 'call_starts', type: 'date', required: true}
				],		  
          returns: {arg: 'result', type: 'object'},
		  http: {path: '/addCallToCampaignWithResult', verb: 'post'},
		  description: "On giving Campaign feedback, it creates a Call instance to record the information about the outcome of the Call"
    });
};
