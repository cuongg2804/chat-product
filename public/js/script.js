import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview@6.1.2/dist/index.js';
//import 'https://unpkg.com/file-upload-with-preview@6.1.2/dist/style.css';


// show-alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show-alert

//CLIENT_SEND_MESSAGE

const formSendData = document.querySelector(".chat .inner-form");

if(formSendData){
    // Upload Images
  const upload = new FileUploadWithPreview('upload-image', {
    multiple: true,
    maxFileCount: 6
  });
  // End Upload Images
  formSendData.addEventListener("submit",(event) => {
    event.preventDefault();
    console.log("ok");
    
    const content = formSendData.content.value || "";
    //Upload image
    const images = upload.cachedFileArray; 
    //End upload image

    if(content || images){
      
      socket.emit("CLIENT_SEND_MESSAGE", {
        content : content,
        images : images
      });
      formSendData.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("SERVER_SEND_TYPING","hidden");
    }
  })
  
}

//END //CLIENT_SEND_MESSAGE


// SERVER_RETURN_DATA
socket.on("SERVER_RETURN_DATA", (data) => {
  
  const body = document.querySelector(".chat .inner-body");
  const userId = document.querySelector("[my-id]").getAttribute("my-id");
  const div = document.createElement("div");

  let htmlFullName = "";
  let htmlContent = "";
  let htmlImage = "";

  if(data.userID != userId){
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.userFullname}<div>`;
  //   div.innerHTML = `
    
  //   <div class="inner-content">${data.content}<div>
  // `;
  }
  else {
    div.classList.add("inner-outgoing");
  }

  if(data.content){
    htmlContent = `<div class="inner-content">${data.content}<div>`;
  }

  if(data.images.length > 0) {
    htmlImage += `<div class="inner-images">`;

    data.images.forEach(image =>{
      htmlImage += `<img src="${image}">`;
    })

    htmlImage += "</div>"
  }
  div.innerHTML = `${htmlFullName} ${htmlContent} ${htmlImage}`;
  const elemetnListTyping = body.querySelector(".inner-list-typing");
  body.insertBefore(div, elemetnListTyping);
  new Viewer(div);
})

//END SERVER_RETURN_DATA


//Scroll Chat to Bottom
const chatBody = document.querySelector(".chat .inner-body");
if(chatBody){
  chatBody.scrollTop = chatBody.scrollHeight;

}

//End Scroll Chat to Bottom

//emoji-picker
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker){
  emojiPicker.addEventListener('emoji-click', event => {
    const input = document.querySelector(".chat .inner-form input[name='content']");
    input.value += event.detail.unicode;

  });
}
//End emoji-picker

//tooltip emoji-picker
const btnIcon = document.querySelector(".button-icon");
if(btnIcon){

  const tooltip = document.querySelector(".tooltip");

  Popper.createPopper(btnIcon, tooltip);
  btnIcon.addEventListener("click",() => {
    tooltip.classList.toggle('shown');
  })
}

//End tooltip emoji-picker


//Typing 
var timeOut;
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
if(inputChat){
  inputChat.addEventListener("keyup", () => {
    socket.emit("SERVER_SEND_TYPING","show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      socket.emit("SERVER_SEND_TYPING","hidden");
    }, 3000);
  })
}

//End Typing


// SERVER_RETURN_TYPING
const listTyping = document.querySelector(".chat  .inner-list-typing");

socket.on("SERVER_RETURN_TYPING", (data) => {
 
   if(data.type == "show"){
    const existTypingBox = listTyping.querySelector(`.box-typing[user-id="${data.userID}"]`);
    if(!existTypingBox){
      const divTyping = document.createElement("div");
      divTyping.classList.add("box-typing");
      divTyping.setAttribute("user-id", data.userID);
      divTyping.innerHTML =`
          <div class="inner-name"> ${data.fullName} </div>
          <div class="inner-dots">
            <span> </span>
            <span> </span>
            <span> </span>
          </div>
      `;
      listTyping.appendChild(divTyping);
    }
 }
  else{
    const removeTypingBox = listTyping.querySelector(`.box-typing[user-id = "${data.userID}"]`);
    console.log(removeTypingBox);
    if(removeTypingBox){
      listTyping.removeChild(removeTypingBox);
    }
  }
})
//End SERVER_RETURN_TYPING

// const viewer = new Viewer(document.querySelector('.inner-images'), {
//   inline: true,
//   viewed() {
//     viewer.zoomTo(1);
//   },
// });

// Preview Images Chat
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  new Viewer(bodyChat);
}
// End Preview Images Chat



