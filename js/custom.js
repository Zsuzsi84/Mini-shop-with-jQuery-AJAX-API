jQuery(document).ready(function ($) {
  //alert(1); //-test, hogy mukodik e
  $("#myCart").html(getCookie("cart_items")); //3.resze
  //1
  $.ajax({
    type: "GET",
    url: "https://637b437210a6f23f7fa3ab7c.mockapi.io/products/",
    success: function (obj) {
      //Megkapjuk az Apibol a neveket a HTML-be:
      let productsEl = $("#products"); //megjeloles
      let html = "";

      //API-ba van/elobb megszerkeztettem ott, itt szinezzuk a HTML-t is:
      for (let i = 0; i < obj.length; i++) {
        html +=
          "<div class='col-md-4 card-items'>" +
          "<div class='card'>" +
          "<img src='" +
          obj[i].product_image +
          "' alt=''>" +
          "<div class='card-body'>" +
          "<h5 class='card-title'>" +
          obj[i].product_name +
          "</h5>" +
          "<p class+'card-text'>" +
          obj[i].product_price +
          " Ft</p>" +
          "<button class='btn btn-primary addToCart' data-product_id='" +
          obj[i].id +
          "'>KOSÁRBA</button>" +
          "<button class='btn btn-info seeMore' data-product_id='" +
          obj[i].id +
          "'data-bs-toggle='modal' data-bs-target='#seeMoreModal'>Részletek</button>" +
          "</div>" +
          "</div>" +
          "</div>";
      }

      productsEl.html(html); //ez dobja be a HTML-be},
    },
  });
  //2
  let totalPrice = 0; //1.Total=az osszeg kiszamolasa
  let itemAlreadyAdded = false; //1.h lehessen tobbet bedobni a kosarba

  $(document).on("click", ".addToCart", function () {
    let id = $(this).attr("data-product_id"); //beindito kodja az also funkcionak

    if (!itemAlreadyAdded) {
      //2.h lehessen tobbet bedobni a kosarba
      //Cimek felirasa:
      $("#myCart").html(
        "<div class='row'>" +
          "<div class='col-md-9'><h3>KOSÁR</h3></div>" +
          "<div class='col-md-3'><b>Végösszeg: </b> <span id='totalPrice'></span> Ft</div>" +
          "</div>"
      );

      itemAlreadyAdded = true; //3.h lehessen tobbet bedobni a kosarba
    }

    $.ajax({
      type: "GET",
      url: "https://637b437210a6f23f7fa3ab7c.mockapi.io/products/" + id,
      success: function (obj) {
        document.getElementById("myCart").innerHTML +=
          "<div class='row cart-items' id='cart-item-" +
          obj.id +
          "'>" + //1.torolje az egesz sort
          "<div class='col-md-4'>" +
          obj.product_name +
          "</div>" +
          "<div class='col-md-3'><b>Gyártó: </b>" +
          obj.product_material +
          "</div>" +
          "<div class='col-md-2'><b>Ár: </b>" +
          obj.product_price +
          " Ft</div>" +
          "<div class='col-md-2'><button data-product_id='" +
          obj.id +
          "'data-product_price='" +
          obj.product_price +
          "'class='btn btn-danger removeFromCart' type='button'>Kosár ürítése</button></div>" + //1.remove from cart, torolje
          "</div>";
        //console.log(obj);

        //2.Total=az osszeg kiszamolasa:
        totalPrice += parseFloat(obj.product_price);
        $("#totalPrice").text(totalPrice);

        //Coockie 2 esze:
        setCookie("cart_items", $("#myCart").html(), 5); //5 nap mulva lejarjon
      },
    });
  });

  //3
  $(document).on("click", ".seeMore", function () {
    let id = $(this).attr("data-product_id");
    //console.log(id); //megnezzuk jol kivette e az ID-ket

    $.ajax({
      type: "GET",
      url: "https://637b437210a6f23f7fa3ab7c.mockapi.io/products/" + id,
      success: function (obj) {
        $("#productDetails").html(
          "<p>" +
            obj.product_description +
            "</p>" +
            "<p><b>Gyártó: </b>" +
            obj.product_material +
            "</p>" +
            "<p><b>Ár: </b>" +
            obj.product_price +
            " Ft</p>"
        );
      },
    });
  });
  //4
  $(document).on("click", ".removeFromCart", function () {
    let id = $(this).attr("data-product_id");

    $("#cart-item-" + id).remove(); //2.torolje az egesz sort

    //Torolni a Total osszeget:
    let total = parseInt($("#totalPrice").text());
    total = total - parseInt($(this).attr("data-product_price"));
    $("#totalPrice").text(total);

    //Cookie 4 resze:
    setCookie("cart_items", $("#myCart").html(), 5);
  });
});

//Cookies: 1resze, feljebb van meg 3 resz
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//190sor volt a JS
