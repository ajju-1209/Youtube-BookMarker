//you can get this same code from chrome docs read them for better understanding

export async function getActiveTabURL(){
    let queryOptions = {active:true,currentWindow:true};
    let [tab]=await chrome.tabs.query(queryOptions);
    return tab;
}