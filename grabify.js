function order(value) {
  localStorage.setItem("order", value);
}

function getorder() {
  let storedDifficulty = localStorage.getItem("order");
  return storedDifficulty ? parseInt(storedDifficulty) : 1;
}
function saveArrayToLocalStorage(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}
function getArrayFromLocalStorage(key) {
  let storedArray = localStorage.getItem(key);
  return storedArray ? JSON.parse(storedArray) : [];
}
let time = 5;
let timer;
let openorder = getArrayFromLocalStorage("openorder");
let unitcost = getArrayFromLocalStorage("unitcost");
let quantity = getArrayFromLocalStorage("quantity");
let cost = getArrayFromLocalStorage("cost");

$(document).ready(function () {
  if (document.title === "mainpage") {
    if (openorder.length > 0) {
      $(".container").fadeIn(2000);
      $("#openorder").stop();
      $("#openorder").slideDown();
      $("#showorderbutton").on("click", showopenorder);
      for (let i = 0; i < openorder.length; i++) {
        for (let j = 1; j <= 16; j++) {
          if (openorder[i] == $("#name" + j).text()) {
            $("#label" + j).text(quantity[i] - 1);
            increase(j);
            break;
          }
        }
      }
    } else {
      $(".container").fadeIn(2000);
      $("#openorder").slideUp(3500);
    }

    for (let i = 1; i <= 16; i++) {
      $("#increase" + i).on("click", function () {
        increase(i);
      });
      $("#decrease" + i).on("click", function () {
        decrease(i);
      });
    }

    $("#cat1").on("click", showall);
    $("#cat2").on("click", showfruits);
    $("#cat3").on("click", showbakery);
    $("#cat4").on("click", showdairy);
    $("#cat5").on("click", showsnack);

    $("#searchtext").on("input", function () {
      const searchText = $("#searchtext").val().trim().toLowerCase();
      search(searchText);
    });
    setTimeout(function () {
      $("#showorderbutton").on("click", showopenorder);
    }, 3500);
    $("#basketlogo").on("click", gotoHistory);
  }
  if (document.title === "openorder") {
    createDynamicTable(
      getArrayFromLocalStorage("openorder"),
      getArrayFromLocalStorage("unitcost"),
      getArrayFromLocalStorage("quantity"),
      getArrayFromLocalStorage("cost")
    );
    $("#table-container").slideDown(2000);
    displaytotal();
    $(document).on("click", ".delete-row", function () {
      $(this).closest("tr").remove();
      if (getColumnArray("product").length == 0) {
        resetarrays();
        gotomain();
      }
      displaytotal();
    });
    $(document).on("click", ".increase-quantity", function () {
      let row = $(this).closest("tr");
      let quantityCell = row.find(".quantity");
      let currentQuantity = parseInt(quantityCell.text());
      quantityCell.text(currentQuantity + 1);
      updateCost(row);
      displaytotal();
    });
    $(document).on("click", ".decrease-quantity", function () {
      let row = $(this).closest("tr");
      let quantityCell = row.find(".quantity");
      let currentQuantity = parseInt(quantityCell.text());
      if (currentQuantity > 1) {
        quantityCell.text(currentQuantity - 1);
        updateCost(row);
      } else if (currentQuantity === 1) {
        row.remove();
      }
      if (getColumnArray("product").length == 0) {
        resetarrays();
        gotomain();
      }
      displaytotal();
    });
    $("#confirmorder").on("click", function () {
      confirmorder();
    });
    $("#backtoorder").on("click", function () {
      $("#confirmorder").off("click");
      clearInterval(timer);
      $("#table-container").slideUp(2000);
      setTimeout(continueorder, 2000);
    });
  }
  if (document.title === "ordershistory") {
    displayPastOrders();
    $("#hideorder").on("click", hideorder);
    $("#backtomain").on("click", function () {
      $("#table-container").slideUp(2000);
      setTimeout(gotomain, 2000);
    });
    $("#reorder").on("click", reorder);
  }
});
function increase(i) {
  let nb = parseInt($("#label" + i).text()) + 1;
  $("#label" + i).text(nb);
  if (!openorder.includes($("#name" + i).text())) {
    openorder.push($("#name" + i).text());
    quantity.push($("#label" + i).text());
    let ucost = $("#cost" + i)
      .text()
      .replace("$", "");
    unitcost.push(ucost);
    let totalcost = parseFloat(
      parseFloat($("#label" + i).text()) * ucost
    ).toFixed(2);
    cost.push(totalcost);
  } else {
    let index = openorder.indexOf($("#name" + i).text());
    quantity[index] = $("#label" + i).text();
    let totalcost = parseFloat(
      parseFloat($("#label" + i).text()) * unitcost[index]
    ).toFixed(2);
    cost[index] = totalcost;
  }
  if (openorder.length == 1) {
    $("#openorder").stop();
    $("#openorder").slideDown();
    $("#showorderbutton").on("click", showopenorder);
  }
  let sum = 0;
  for (let i = 0; i < cost.length; i++) {
    sum += parseFloat(cost[i]);
  }
  sum = sum.toFixed(2);
  $("#cost").text(sum + "$");
}
function decrease(i) {
  let index = openorder.indexOf($("#name" + i).text());
  let nb = parseInt($("#label" + i).text()) - 1;
  if (nb >= 0) {
    $("#label" + i).text(nb);
    quantity[index] = $("#label" + i).text();
    let totalcost =
      parseFloat($("#label" + i).text()) *
      parseFloat(unitcost[index]).toFixed(2);
    cost[index] = totalcost;
  }
  if (nb == 0) {
    openorder.splice(index, 1);
    quantity.splice(index, 1);
    unitcost.splice(index, 1);
    cost.splice(index, 1);

    if (openorder.length == 0) {
      $("#openorder").slideUp();
    }
  }
  let sum = 0;
  for (let i = 0; i < cost.length; i++) {
    sum += parseFloat(cost[i]);
  }
  sum = sum.toFixed(2);
  $("#cost").text(sum + "$");
}
function showall() {
  $(".Fruits").fadeIn("slow");
  $(".Bakery").fadeIn("slow");
  $(".Dairy").fadeIn("slow");
  $(".Snack").fadeIn("slow");
  $("#searchtext").val("");
}
function showfruits() {
  $(".Fruits").fadeIn("slow");
  $(".Bakery").fadeOut("slow");
  $(".Dairy").fadeOut("slow");
  $(".Snack").fadeOut("slow");
  $("#searchtext").val("");
}

function showbakery() {
  $(".Fruits").fadeOut("slow");
  $(".Bakery").fadeIn("slow");
  $(".Dairy").fadeOut("slow");
  $(".Snack").fadeOut("slow");
  $("#searchtext").val("");
}
function showdairy() {
  $(".Fruits").fadeOut("slow");
  $(".Bakery").fadeOut("slow");
  $(".Dairy").fadeIn("slow");
  $(".Snack").fadeOut("slow");
  $("#searchtext").val("");
}
function showsnack() {
  $(".Fruits").fadeOut("slow");
  $(".Bakery").fadeOut("slow");
  $(".Dairy").fadeOut("slow");
  $(".Snack").fadeIn("slow");
  $("#searchtext").val("");
}
function search(text) {
  for (let i = 1; i <= 16; i++) {
    const nameText = $("#name" + i)
      .text()
      .trim()
      .toLowerCase();
    if (nameText.startsWith(text)) {
      $("#div" + i).fadeIn("slow");
    } else {
      $("#div" + i).fadeOut("slow");
    }
  }
}
function showopenorder() {
  saveArrayToLocalStorage("openorder", openorder);
  saveArrayToLocalStorage("unitcost", unitcost);
  saveArrayToLocalStorage("quantity", quantity);
  saveArrayToLocalStorage("cost", cost);

  window.location.href = "openorder.html";
}
function createDynamicTable(products, unitCosts, quantities, costs) {
  let table = $("<table></table>").addClass("product-table");
  table.empty();
  let headerRow = `
    <tr>
      <th>Product</th>
      <th>Quantity</th>
      <th>Unit Cost</th>
      <th>Cost</th>
      <th class="action">Action</th>
    </tr>`;
  table.append(headerRow);

  let rowCount = products.length;

  for (let i = 0; i < rowCount; i++) {
    let row = `
      <tr>
        <td class="product">${products[i]}</td>
        <td class="quantity">${quantities[i]}</td>
        <td class="unit-cost">${unitCosts[i]}</td>
        <td class="cost">$${costs[i]}</td>
        <td class="action"><button class="delete-row action1">Delete</button>
         <button  class="increase-quantity action1">+</button>
      <button class="decrease-quantity action1">-</button></td>
        
      </tr>`;
    table.append(row);
  }

  $("#table-container").html(table);
}
function updateCost(row) {
  let quantity = parseInt(row.find(".quantity").text());
  let unitCost = parseFloat(row.find(".unit-cost").text().replace("$", ""));
  let totalCost = (quantity * unitCost).toFixed(2);
  row.find(".cost").text(`$${totalCost}`);
}
function getColumnArray(columnClass) {
  let values = [];
  $(`.${columnClass}`).each(function () {
    values.push($(this).text().replace("$", ""));
  });
  return values;
}
function placeorder() {
  let ornb = getorder();
  resetarrays();
  $("#backtoorder").hide();
  displaytotal();
  saveArrayToLocalStorage("product" + ornb, getColumnArray("product"));
  saveArrayToLocalStorage("unitcost" + ornb, getColumnArray("unit-cost"));
  saveArrayToLocalStorage("quantity" + ornb, getColumnArray("quantity"));
  saveArrayToLocalStorage("cost" + ornb, getColumnArray("cost"));
  let currentDateTime = new Date();
  localStorage.setItem("date" + ornb, currentDateTime.toISOString());
  clearInterval(timer);
  order(ornb + 1);
  $("#successfull").text("order placed successfully");
  $(".action").hide();
  $("#table-container").slideUp(2800);
  setTimeout(gotomain, 3000);
}
function displaytotal() {
  let totalarr = getColumnArray("cost");
  let total = 0;
  for (let i = 0; i < totalarr.length; i++) {
    total += parseFloat(totalarr[i].replace("$", ""));
  }
  total = total.toFixed(2);
  $("#totalamount").text("total: $" + total);
}
function gotomain() {
  window.location.href = "index.html";
}
function resetarrays() {
  let a = [];
  saveArrayToLocalStorage("openorder", a);
  saveArrayToLocalStorage("quantity", a);
  saveArrayToLocalStorage("unitcost", a);
  saveArrayToLocalStorage("cost", a);
}
function continueorder() {
  resetarrays();
  saveArrayToLocalStorage("openorder", getColumnArray("product"));
  saveArrayToLocalStorage("quantity", getColumnArray("quantity"));
  saveArrayToLocalStorage("unitcost", getColumnArray("unit-cost"));
  saveArrayToLocalStorage("cost", getColumnArray("cost"));
  window.location.href = "index.html";
}

function gotoHistory() {
  window.location.href = "orderHistory.html";
}

function displayPastOrders() {
  let orderNumber = getorder() - 1;
  let tableContainer = $("#table-container");
  tableContainer.empty();

  let table = $("<table></table>").addClass("past-orders-table product-table");
  let headerRow = `
      <tr>
          <th>Order Number</th>
          <th>Date</th>
          <th>Actions</th>
      </tr>`;
  table.append(headerRow);

  for (let i = orderNumber; i >= 1; i--) {
    let orderDate = localStorage.getItem("date" + i);
    if (orderDate) {
      let row = `
              <tr>
                  <td>Order ${i}</td>
                  <td>${new Date(orderDate).toLocaleString()}</td>
                  <td><button id = "view-order${i}" class="view-order action action1" >View Order</button></td>
              </tr>`;
      table.append(row);
    }
  }
  tableContainer.append(table);
  tableContainer.slideDown(2000);

  for (let i = 1; i <= orderNumber; i++) {
    $("#view-order" + i).on("click", function () {
      setTimeout(function () {
        displayOrderDetails(i);
      }, 2000);
      $("#table-container").slideUp(2000);
    });
  }
}

function displayOrderDetails(orderNumber) {
  let products = getArrayFromLocalStorage("product" + orderNumber);
  let unitCosts = getArrayFromLocalStorage("unitcost" + orderNumber);
  let quantities = getArrayFromLocalStorage("quantity" + orderNumber);
  let costs = getArrayFromLocalStorage("cost" + orderNumber);
  setTimeout(createDynamicTable(products, unitCosts, quantities, costs), 2000);
  setTimeout($("#table-container").slideDown(2000), 2000);
  $(".action").hide();
  $("#details").fadeIn();

  displaytotal();
}
function hideorder() {
  $("#details").fadeOut();
  $("#table-container").slideUp(2000);
  setTimeout(displayPastOrders, 2000);
}
function reorder() {
  let ornb = getorder();
  resetarrays();

  saveArrayToLocalStorage("product" + ornb, getColumnArray("product"));
  saveArrayToLocalStorage("unitcost" + ornb, getColumnArray("unit-cost"));
  saveArrayToLocalStorage("quantity" + ornb, getColumnArray("quantity"));
  saveArrayToLocalStorage("cost" + ornb, getColumnArray("cost"));
  let currentDateTime = new Date();
  localStorage.setItem("date" + ornb, currentDateTime.toISOString());

  order(ornb + 1);
  $("#details").hide();
  $("#table-container").slideUp(2000);
  setTimeout(displayPastOrders, 2000);
}
function confirmorder() {
  $("#confirmorder").text("confirm");

  timer = setInterval(interval, 1000);
  $("#backtoorder").on("click", function () {
    $("#totalamount").text("order cancelled");
    $("#totalamount").css("color", "red");
    $("#confirmorder").hide();
    clearInterval(timer);
    $("#table-container").slideUp(2000);
    setTimeout(continueorder, 2000);
  });
  $("#confirmorder").off("click");
  $("#confirmorder").on("click", function () {
    placeorder();
  });
}
function interval() {
  time -= 1;
  if (time > 0) {
    $("#totalamount").text("you have " + time + " seconds to cancel order");
  } else {
    placeorder();
  }
}
