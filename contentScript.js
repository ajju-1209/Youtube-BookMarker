(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  //This array will store all bookmarks of current video
  let currentVideoBookmarks = [];

  //This function what it will do is whenever a new video is loaded 
    //it fetches all the bookmarks of this video form chrome storage where they were 
    //stored in json format in some earlier times.

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };


//Adding new Bookmark of the video
  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;

    //This is what a new bookmark will contain a time and a description
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    //to know more about chrome storage read docs
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
       //If bookmark button does'nt exists in this youtube page (Basically if we are coming first time to this page so how would it exists ,funny ha ,so we gotta create one and inject it in this youtube page)
      //so creating an image button to inject in this page
      const bookmarkBtn = document.createElement("img");

      //defining attributes for this element like image ,title etc etc
      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";

      //This will show when you hover over the button
      bookmarkBtn.title = "Click to bookmark current timestamp";

      //grasping the hold of element which we have to manipulate in our page
      //These element are present in every youtube video page you can check them by yourself by typing it in console
      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName('video-stream')[0];
      //Injecting our element in page
      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    //check whether current video is loaded or not
    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if ( type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
      chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

      response(currentVideoBookmarks);
    }
  });

  newVideoLoaded();
})();

//converting seconds into usual time (hours,minutes,sec)
const getTime = t => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};
