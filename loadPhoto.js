import {checkIfPhotoIsLiked, getHistory, writeHistoryToStorage} from "./storage.js";

const photoBlock = document.querySelector(".main__photo-img")
const authorName = document.querySelector(".main__author p")
const likesAmt = document.querySelector(".main__likes-amt")
const authorInfoEl = document.querySelector(".main__author-info")
const imgInfoEl = document.querySelector(".main__img-info")
const historyBlock = document.querySelector(".main__history")
const photoInfoEl = document.querySelector(".photo-info")
const tagsEl = document.querySelector(".main__tags")

export async function loadPhoto (link) {
    let response = await fetch(link)
    let data = await response.json()
    console.log(data)

    authorName.textContent = `by user ${data.user["username"]}`
    likesAmt.textContent = `${data["likes"]}`

    photoBlock.style.backgroundImage = `url('${data.urls["small"]}')`

    document.querySelector(".main__title-likes").setAttribute("data-photoId", `${data["id"]}`)

    imgInfoEl.innerHTML = '<h2 class = "main__img-title" > Image Info </h2>'
    let newImgInfo = document.createElement("p")
    newImgInfo.textContent = `Created at `
    imgInfoEl.appendChild(newImgInfo)

    newImgInfo = document.createElement("p")
    imgInfoEl.appendChild(newImgInfo)
    const dateUTC = new Date(`${data["created_at"]}`)
    newImgInfo.textContent = dateUTC.toUTCString()

    newImgInfo = document.createElement("p")
    newImgInfo.textContent = `Description `
    imgInfoEl.appendChild(newImgInfo)

    newImgInfo = document.createElement("p")
    imgInfoEl.appendChild(newImgInfo)
    data["alt_description"] == null ? newImgInfo.textContent = `${data["description"]}` : newImgInfo.textContent = `${data["alt_description"]}`

    newImgInfo = document.createElement("p")
    newImgInfo.textContent = `Views `
    imgInfoEl.appendChild(newImgInfo)

    newImgInfo = document.createElement("p")
    imgInfoEl.appendChild(newImgInfo)
    newImgInfo.textContent = `${data["views"].toLocaleString()}`

    newImgInfo = document.createElement("p")
    newImgInfo.textContent = `Downloads`
    imgInfoEl.appendChild(newImgInfo)

    newImgInfo = document.createElement("p")
    imgInfoEl.appendChild(newImgInfo)
    newImgInfo.textContent = `${data["downloads"].toLocaleString()}`

    authorInfoEl.innerHTML = '<h2 class="main__img-title">Author Info</h2>'
    let newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = "Name"

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = `${data.user["name"]}`

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = "Total collections"

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = `${data.user["total_collections"].toLocaleString()}`

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = "Total likes"

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = `${data.user["total_likes"].toLocaleString()}`

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = "Total photos"

    newAuthorInfo = document.createElement("p")
    authorInfoEl.appendChild(newAuthorInfo)
    newAuthorInfo.textContent = `${data.user["total_photos"].toLocaleString()}`

    if (data.user["social"]["instagram_username"] !== null) {
        newAuthorInfo = document.createElement("p")
        authorInfoEl.appendChild(newAuthorInfo)
        newAuthorInfo.textContent = "Instagram"
        newAuthorInfo = document.createElement("p")
        authorInfoEl.appendChild(newAuthorInfo)
        newAuthorInfo.textContent = `${data.user["social"]["instagram_username"]}`
    }

    if (data.user["social"]["portfolio_url"] !== null) {
        newAuthorInfo = document.createElement("p")
        authorInfoEl.appendChild(newAuthorInfo)
        newAuthorInfo.textContent = "Portfolio URL"
        newAuthorInfo = document.createElement("a")
        authorInfoEl.appendChild(newAuthorInfo)
        newAuthorInfo.textContent = `${data.user["social"]["portfolio_url"]}`
        newAuthorInfo.setAttribute("href", `${data.user["social"]["portfolio_url"]}`)
    }

    if (data.user["social"]["twitter_username"] !== null) {
        newAuthorInfo = document.createElement("p")
        authorInfoEl.appendChild(newAuthorInfo)
        newAuthorInfo.textContent = "Twitter"
        newAuthorInfo = document.createElement("p")
        authorInfoEl.appendChild(newAuthorInfo)
        newAuthorInfo.textContent = `${data.user["social"]["twitter_username"]}`
    }

    photoInfoEl.innerHTML = ""
    if (data["exif"]["name"] !== null) {
        newImgInfo = document.createElement("p")
        newImgInfo.textContent = `${data["exif"]["name"]}`
        photoInfoEl.appendChild(newImgInfo)
    }

    if (data["location"]["name"]) {
        newImgInfo = document.createElement("p")
        newImgInfo.textContent = `${data["location"]["name"]}`
        photoInfoEl.appendChild(newImgInfo)
    }


    if (checkIfPhotoIsLiked(data['id'])) {
        document.getElementById("heart").style.fill = "#bd2828"
    } else {
        document.getElementById("heart").style.fill = "#757474"
    }

    writeHistoryToStorage(data["id"])
    loadTags(data)
    loadHistory()
}

export function loadTags(data) {
    const tagsArr = data["tags"]
    tagsEl.innerHTML = '<h2 class="main__img-title">Tags</h2>'
    const tagsBlock = document.createElement("div")
    tagsEl.appendChild(tagsBlock)
    tagsBlock.classList.add("main__tags-block")
    tagsArr.forEach((tag) => {
        if (tag["type"] === "search") {
            const newTag = document.createElement("a")
            newTag.setAttribute("href", "#")
            newTag.textContent = tag["title"]
            tagsBlock.appendChild(newTag)
        }
    })
}
export function loadHistory() {
    historyBlock.innerHTML = '<h2 class="main__img-title"> History </h2>'
    getHistory().forEach((imgID) => {
        const newLink = document.createElement("a")
        historyBlock.appendChild(newLink)
        newLink.classList.add("history__link")
        const link = `https://api.unsplash.com/photos/${imgID}/?client_id=-GVWf28-rl1LyzqV3gfzrEscjZb5hAuWYnySgwmJkuo`
        newLink.addEventListener("click", () => loadPhoto(link))


        let historyElem = getPhotoHistory(link)

        historyElem.then((photo) => {
            newLink.addEventListener("mouseover", () => getModalPhoto(photo.urls["thumb"]))
            newLink.addEventListener("mouseout", () => document.getElementById("modal").style.display = "none")

            const authorName = document.createElement("p")
            newLink.appendChild(authorName)
            const dateUTC = new Date(`${photo["created_at"]}`)
            authorName.textContent = photo.user["name"] + "  |  " + dateUTC.toDateString()

            if (photo["location"]["name"] !== null) authorName.textContent += "  |  " + photo["location"]["name"]

            const imgDesc = document.createElement("p")
            newLink.appendChild(imgDesc)
            photo["description"] !== null ? imgDesc.textContent = photo["description"] : imgDesc.textContent = photo["alt_description"]
        })
    })
}


function getModalPhoto(photo) {
    document.getElementById("modal").style.display = "block"
    document.getElementById("modal").style.backgroundImage = `url('${photo}')`
}

async function getPhotoHistory (link) {
    let response = await fetch(link)
    return await response.json()
}

