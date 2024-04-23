import {loadHistory, loadPhoto} from "./loadPhoto.js";
import {checkIfPhotoIsLiked, removeLikesFromStorage, writeLikesToStorage} from "./storage.js";

let numOfLikes = 0
const link = 'https://api.unsplash.com/photos/random/?client_id=-GVWf28-rl1LyzqV3gfzrEscjZb5hAuWYnySgwmJkuo'

loadPhoto(link).then(() => {
     numOfLikes= parseInt(document.querySelector(".main__likes-amt").textContent)
})

loadHistory()

const likeEl = document.querySelector(".main__likes svg")

likeEl.addEventListener("click", () => {
    const photoID = document.querySelector(".main__title-likes").getAttribute("data-photoId")

    if (checkIfPhotoIsLiked(photoID)) {
        document.getElementById("heart").style.fill = "#757474"
        numOfLikes -= 1
        removeLikesFromStorage(photoID)
    } else {
        document.getElementById("heart").style.fill = "#bd2828"
        numOfLikes += 1
        const photoID = document.querySelector(".main__title-likes").getAttribute("data-photoId")
        writeLikesToStorage(photoID, numOfLikes)
    }
    document.querySelector(".main__likes-amt").textContent = numOfLikes
})

const historyEl = document.querySelector(".main__history")

historyEl.addEventListener("mouseover", modalMoveWithMouse)
historyEl.removeEventListener("mouseout", modalMoveWithMouse)

function modalMoveWithMouse () {
    document.addEventListener('mousemove', e => {
        document.getElementById("modal").style.left = (e.pageX - 220) + "px"
        document.getElementById("modal").style.top = (e.pageY - 220)+ "px"
    });
}
