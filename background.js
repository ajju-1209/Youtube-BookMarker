// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//     if (tab.url && tab.url.includes("youtube.com/watch")) {
//       const queryParameters = tab.url.split("?")[1];
//       const urlParameters = new URLSearchParams(queryParameters);
  
//       chrome.tabs.sendMessage(tabId, {
//         type: "NEW",
//         videoId: urlParameters.get("v"),
//       });
//     }
//   });

chrome.tabs.onUpdated.addListener((tabId,tab)=>{
//First we checked whether this tab in which we are as of now
//has url or not ,if it has whether it is the url we are hoping to have?
//we want url which includes youtube.com/watch in it ,as every
//url when we watch a youtube video includes "youtube.com/watch".
	if(tab.url && tab.url.includes("youtube.com/watch")){


		//This is a url when you watch a video on youtube
		// it consists of "www.youtube.com/watch" which i am looking for in a url.

		// www.youtube.com/watch?v=0n809nd4Zu4&list=PLcD6SZY-__Fw2gKHg6BBbvdkdyo7UDbRP

		//"?v=0n809nd4Zu4&list=PLcD6SZY-__Fw2gKHg6BBbvdkdyo7UDbRP" this portion is called 
		//query string parameters it is used for sending data in url 
		//I am spitting up it after "?"
		const queryParameters=tab.url.split("?")[1];
		const urlParameters=new URLSearchParams(queryParameters);
		console.log(urlParameters);

      //Read docs for sendMessage function
      	chrome.tabs.sendMessage(tabId,{
        	type:"NEW",
        	videoId:urlParameters.get("v"),
    	});
	}
});
           