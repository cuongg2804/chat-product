

//Chức năng gửi yêu cầu kết bạn
const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(btnAddFriend.length > 0){
    btnAddFriend.forEach((button) =>{
        button.addEventListener("click", () =>{
            button.closest(".box-user").classList.add("add");

            const userIDB = button.getAttribute("btn-add-friend");
            
            socket.emit("CLIENT_ADD_FRIEND",userIDB )
        })
    })
    
}
// Hết chức năng gửi yêu cầu kết bạn

//Chức năng hủy Lời mời đã gửi
const btnCancel = document.querySelectorAll("[btn-cancel-friend]");
if(btnCancel.length > 0){
    btnCancel.forEach((button) => {
        button.addEventListener("click",( )=> {
            button.closest(".box-user").classList.remove("add");

            const userIdB = button.getAttribute("btn-cancel-friend");
           
            socket.emit("CLIENT_CANCEL_FRIREND", userIdB);
        })
    })
}
//Hết chức năng hủy lời mời đã gửi

//Chức năng hủy Lời mời kết bạn
const btnXoa = document.querySelectorAll("[btn-refuse-friend]");
if(btnXoa){
    btnXoa.forEach((button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            button.closest(".box-user").classList.remove("refuse");
        })
    })
}

//Hết Lời mời kết bạn


//Chức năng  đồng ý kết bạn

const function_AcceptButton = () => {
    const acceptButton = (button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("accepted");
    
            const userIDB = button.getAttribute("btn-accept-friend");
            
           socket.emit("CLIENT_ACCEPT_FRIREND", userIDB);
        })
    }
    const btnChapNhan = document.querySelectorAll("[btn-accept-friend]");
    if(btnChapNhan.length > 0) {
        btnChapNhan.forEach((button) => {
            acceptButton(button);
        })
    }
}
function_AcceptButton();
//Hết chức năng đồng ý kết bạn

//Chức năng không đồng ý kết bạn

const function_ButtonCancel = () => {
    const cancelButton = (button) => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
    
            const userIDB = button.getAttribute("btn-refuse-friend");
            
            socket.emit("CLIENT_REFUSE_FRIREND", userIDB);
        })
    }
    
    const btnHuyKetBan = document.querySelectorAll("[btn-refuse-friend]");
    if(btnHuyKetBan.length > 0) {
        btnHuyKetBan.forEach((button) => {
            cancelButton(button);
        })
    }
}
function_ButtonCancel();
//Hết chức năng không đồng ý kết bạn


//Thông báo số lượng Lời mời kết bạn
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const ID_badgeUsersAccept = document.querySelector(`[badge-users-accept="${data.userId}"]`);
    if(ID_badgeUsersAccept){
        ID_badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
;
    }

})
// Hết thông báo số lượng Lời mời kết bạn


////Thêm thông tin của B vào danh sách kết bạn của A
socket.on("SERVER_RETURN_INFOR_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);
    if(dataUsersAccept){
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");
        newBoxUser.setAttribute("user-id",data.inforUserA._id)
        newBoxUser.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="https://robohash.org/hicveldicta.png" alt=${data.inforUserA.fullName}/>
                </div>
                <div class="inner-info">
                    <div class="inner-name">
                        ${data.inforUserA.fullName}
                    </div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm btn-primary mr-1" 
                            btn-accept-friend="${data.inforUserA._id}"
                        >  
                            Chấp nhận  
                        </button>

                        <button 
                            class="btn btn-sm btn-secondary mr-1" 
                            btn-refuse-friend="${data.inforUserA._id}"
                        >  Xóa 
                        </button>

                        <button 
                            class="btn btn-sm btn-secondary mr-1" 
                            btn-deleted-friend="" 
                            disabled=""
                        >   Đã xóa  
                        </button>

                        <button 
                            class="btn btn-sm btn-primary mr-1" 
                            btn-accepted-friend="" 
                            disabled=""
                        >   Đã chấp nhận    
                        </button>
                    </div>
                </div>
            </div>
        `;
        dataUsersAccept.appendChild(newBoxUser);
        function_ButtonCancel();
        function_AcceptButton();


        const dataUsersNotFriend = document.querySelector(`[data-users-not-friend="${data.userIdB}"]`);
        if(dataUsersNotFriend){
            const userInforA = dataUsersAccept.querySelector(`[user-id="${data.inforUserA._id}"]`);
            if(userInforA){
                dataUsersNotFriend.removeChild(userInforA);
            }
        }
    }
})
//Het thêm thông tin của B vào danh sách kết bạn của A

socket.on("SEVER_RETURN_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector(`[data-users-accept="${data.userIdB}"]`);

    if(dataUsersAccept){
        const userInforA = dataUsersAccept.querySelector(`[user-id="${data.userIdA}"]`);
        if(userInforA){
            dataUsersAccept.removeChild(userInforA);
        }
    }
})





//Hiênj online/offline

socket.on("SERVER_RETURN_STATUS_ONLINE", (data) => {
    const dataUserFriend = document.querySelector("[data-users-friend]");
    if(dataUserFriend) {
        const userIdB = dataUserFriend.querySelector(`[user-id="${data.idUser}"]`)
        if(userIdB){

           const innerSatusBox = dataUserFriend.querySelector(".inner-status");

           innerSatusBox.setAttribute("status", data.statusOnline);
        }
    }
})
//Hết hiện online/offline