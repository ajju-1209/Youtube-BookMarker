//This file deals with the ui of our project

import { getActiveTabURL } from "./utils.js";


// adding a new bookmark row to the popup
const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
 
  //Title is description of the bookmark
  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  //id will be bookmark along with the time at which you saved it
  newBookmarkElement.id = "bookmark-" + bookmark.time;
  //className for adding css 
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }

  return;
};

const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];

   // The URLSearchParams interface defines utility methods 
  // to work with the query string of a URL.

  //URLSearchParams() is a contructor that returns URLSearchParams object instance.
  const urlParameters = new URLSearchParams(queryParameters);
  console.log(urlParameters);

  //The get() method of the URLSearchParams interface returns the first value 
    // associated to the given search parameter.

    //ex-
    //If the URL of your page is https://example.com/?name=Jonathan&age=18 
    // you could parse out the 'name' and 'age' parameters using:
    // let params = new URLSearchParams(document.location.search);
    // let name = params.get("name"); // is the string "Jonathan"
    // let age = parseInt(params.get("age"), 10); // is the number 18

    //so we are getting value of "v" as of you see the url of youtube video
    //https://www.youtube.com/watch?v=mlHS2VaP49k ,here v="mlHS2VaP49k"
    //which is sort of video id which will help us to identify current video

  const currentVideo = urlParameters.get("v");
  console.log("Current video is :" + currentVideo);

  //If this is youtube tab and we are watching youtube video
  //Then retrieve all the saved bookmarks regarding this video 
  //form chrome.storage and view them  
  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }
});

