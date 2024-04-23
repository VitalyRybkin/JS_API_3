export function writeLikesToStorage(photoId, likes) {
    let photoInfo = {}
    if (localStorage["likes"]) {
        photoInfo = JSON.parse(localStorage.getItem("likes"))
    }
    photoInfo[`${photoId}`] = `${likes}`
    localStorage.setItem("likes", JSON.stringify(photoInfo))
}

export function checkIfPhotoIsLiked(photoId) {
    if (localStorage.getItem("likes")) {
        const liked = JSON.parse(localStorage.getItem("likes"))
        return photoId in liked
    }
}

export function removeLikesFromStorage(photoId) {
    const liked = JSON.parse(localStorage.getItem("likes"))
    for (let key in liked) {
        if (key === photoId) delete liked[`${photoId}`]
    }
    localStorage.setItem("likes", JSON.stringify(liked))
}

export function writeHistoryToStorage(photoId) {
    let history = []

    if (localStorage["history"]) history = JSON.parse(localStorage.getItem("history"))
    if (history.length >= 10) history.splice(0, 1)
    if (history.indexOf(photoId) !== -1) history.splice(history.indexOf(photoId), 1)

    history.push(photoId)
    localStorage.setItem("history", JSON.stringify(history))
}

export function getHistory() {
    return  Array.from(JSON.parse(localStorage.getItem("history"))).reverse()
}