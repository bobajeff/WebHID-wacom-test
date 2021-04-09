import('./pkg')
  .catch(console.error);

page_log = text => {
  let p = document.createElement("p");
  p.textContent = text;
  log.appendChild(p);
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
  if (devices.length > 1) {
    page_log(`You have multiple devices.`);
  }
  device = devices[0];
  page_log(`User previously selected "${device.productName}" HID device.`);
  page_log(`Now press "open device" button to receive input reports.`);
});

requestDeviceButton.onclick = async event => {
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
  page_log(`Waiting for user to press button...`);

  device.addEventListener("inputreport", event => {
    const { data, device, reportId } = event;

    let buffArray = new Uint8Array(data.buffer);
    console.log(buffArray);
    // console.log(device);
  
  });
};
