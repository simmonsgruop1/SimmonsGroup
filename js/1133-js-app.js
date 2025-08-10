$('.faq__item').on('click', function () {
    $(this).toggleClass('active');
    if($(this).hasClass('active')){
        $(this).find('.faq__item__text__content').slideDown();
    } else{
        $(this).find('.faq__item__text__content').slideUp();
    }
})



const burgerBtn = document.querySelector(".burger__btn"),
  burger = document.querySelector(".burger"),
  burgerOverlay = document.querySelector(".burger__overlay");

burgerBtn.addEventListener("click", () => {
    burger.classList.toggle("active");
});
burgerOverlay.addEventListener("click", () => {
    burger.classList.remove("active");
});

$('a[href^="#"]').on('click', function (event) {
    event.preventDefault();
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;
    $('html, body').animate({
        scrollTop: dn
    }, 800);
    burger.classList.remove("active");
});