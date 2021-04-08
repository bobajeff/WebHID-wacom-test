import('./pkg')
  .catch(console.error);

page_log = text => {
  // log.innerHTML += `<p>${text}\r\n</p>`;
  let p = document.createElement("p");
  p.textContent = text;
  log.appendChild(p);
};

list_log = text => {
  let li = document.createElement("p");
  let span = document.createElement("span");
  span.textContent = text;
  span.className = "caret";
  span.addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
  li.appendChild(span);
  let ul = document.createElement("ul");
  ul.className = "nested";
  li.appendChild(ul);
  log.appendChild(li);
  return ul;
};

list_item = (text,elm) => {
  let li = document.createElement("li");
  li.textContent = text;
  elm.appendChild(li);
};

let device;

if (!("hid" in navigator)) {
  page_log("WebHID is not available yet.");
}

navigator.hid.getDevices().then(devices => {
  if (devices.length == 0) {
    page_log(`No HID devices selected. Press the "request device" button.`);
    return;
  }
  device = devices[0];
  page_log(`User previously selected "${device.productName}" HID device.`);
  page_log(`Now press "open device" button to receive input reports.`);
});

requestDeviceButton.onclick = async event => {
  // if (window.self !== window.top) {
  //   window.open(location.href, "", "noopener,noreferrer");
  //   return;
  // }
  document.body.style.display = "none";
  try {
    const filters = [
      {
        vendorId: 0x056a, // Wacom Co., Ltd
        productId: 0x00b1 //PTZ-630 [Intuos3 (6x8)]
      },
      {
        vendorId: 0x056a, // Wacom Co., Ltd
        productId: 0x00b2 //PTZ-930 [Intuos3 (9x12)]
      },
      {
        vendorId: 0x056a, // Wacom Co., Ltd
        productId: 0x00b3 //PTZ-1230 [Intuos3 (12x12)]
      },
      {
        vendorId: 0x056a, // Wacom Co., Ltd
        productId: 0x00b4 //PTZ-1231W [Intuos3 (12x19)]
      },
    ];

    [device] = await navigator.hid.requestDevice({ filters });
    if (!device) return;

    page_log(`User selected "${device.productName}" HID device.`);
    page_log(`Now press "open device" button to receive input reports.`);
  } finally {
    document.body.style.display = "";
  }
};

openButton.onclick = async event => {
  if (!device) return;

  await device.open().catch(console.error);
  console.log(`Waiting for user to press button...`);

  for (let collection of device.collections) {
    // A HID collection includes usage, usage page, reports, and subcollections.
    page_log(`Usage: ${collection.usage}`);
    page_log(`Usage page: ${collection.usagePage}`);

    for (let inputReport of collection.inputReports) {
      page_log(`Input report: ${inputReport.reportId}`);
      // Loop through inputReport.items
    }

    for (let outputReport of collection.outputReports) {
      page_log(`Output report: ${outputReport.reportId}`);
      // Loop through outputReport.items
    }

    for (let featureReport of collection.featureReports) {
      let list = list_log(`Feature report: ${featureReport.reportId}`);
      // Loop through featureReport.items
      for (let item of featureReport.items) {
        for (const [key, value] of Object.entries(item)) {
          list_item(`${key}: ${value}`, list);
        }
      }
    }

    // Loop through subcollections with collection.children
  }

  device.addEventListener("inputreport", event => {
    const { data, device, reportId } = event;

    // Handle only the Joy-Con Right device and a specific report ID.
    // if (device.productId != 0x2007 && reportId != 0x3f) return;

    const value_1 = data.getUint8(0);
    const value_2 = data.getUint8(1);
    const value_3 = data.getUint8(2);
    const value_4 = data.getUint8(3);
    const value_5 = data.getUint8(4);
    const value_6 = data.getUint8(5);
    const value_7 = data.getUint8(6);
    const value_8 = data.getUint8(7);
    const value_9 = data.getUint8(8);
    // if (value == 0) return;

    // const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
    console.log(data);
    // console.log("data: " + value + " id: " + reportId );
    console.log(' : ' + value_1
      + ' : ' + value_2 
      + ' : ' + value_3 
      + ' : ' + value_4 
      + ' : ' + value_5 
      + ' pressure: ' + value_6
      + ' : ' + value_7 
      + ' : ' + value_8 
      + ' : ' + value_9
    )
  });
};
