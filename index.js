const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

console.log(deviceType());

async function getData() {
  const url =
    "https://api.taboola.com/2.0/json/apitestaccount/recommendations.get";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        placements: [
          {
            name: "Below Article Thumbnails",
            recCount: 6,
            organicType: "mix",
            thumbnail: {
              width: 640,
              height: 480,
            },
          },
        ],
        user: {
          session: "init",
          realip: "24.126.139.0",
          agent:
            "Mozilla%2F5.0+(Windows+NT+10.0%3B+Win64%3B+x64%3B+ServiceUI+13)+AppleWebKit%2F537.36+(KHTML%2C+like+Gecko)+Chrome%2F64.0.3282.140+Safari%2F537.36+Edge%2F17.17134",
          device: "14A7B4BB0B5B63781A90BE1B0F5B6019",
        },
        app: {
          type: "WEB",
          apiKey: "7be65fc78e52c11727793f68b06d782cff9ede3c",
          name: "take-homechallenge",
          origin: "CLIENT",
        },
        view: {
          id: "a558e7763d614902a3689c69b23c25a7",
        },
        source: {
          type: "TEXT",
          id: "resources/articles",
          url: "https://blog.taboola.com/digiday-publishing-summit",
        },
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.placements[0].list;
    }
  } catch (error) {
    console.log(error);
  }
}

function createItem(itemObj) {
  const item = document.createElement("article");
  item.appendChild(createItemAnchor(itemObj));
  item.className = "article";
  return item;
}

function createItemAnchor(itemObj) {
  const anchor = document.createElement("a");
  anchor.href = itemObj.url;
  anchor.className = "anchor";
  if (itemObj.categories) {
    // anchor.appendChild(createCategory(itemObj));
  }
  anchor.appendChild(createImage(itemObj));
  anchor.appendChild(createName(itemObj));
  anchor.appendChild(createBranding(itemObj));
  return anchor;
}

function createImage(itemObj) {
  const image = document.createElement("img");
  image.className = "image";
  image.src = itemObj.thumbnail[0].url;
  image.alt = itemObj.description || itemObj.name;
  return image;
}

function createName(itemObj) {
  const name = document.createElement("strong");
  name.className = "name";
  const text = itemObj.name;
  if (text.length > 137) {
    name.innerText = text.slice(0, 138) + "...";
  } else {
    name.innerText = text;
  }
  return name;
}

function createBranding(itemObj) {
  const brand = document.createElement("p");
  brand.className = "brand";
  if (itemObj.categories && itemObj.categories.length > 0) {
    brand.innerText = `${itemObj.categories[0]} | ${itemObj.branding}`;
  } else {
    brand.innerText = itemObj.branding;
  }
  return brand;
}

// function createCategory(itemObj) {
//   const category = document.createElement("p");
//   category.className = "catergory";
//   category.innerText = itemObj.categories[0];
//   return category;
// }

async function generateWidget() {
  const articles = await getData();
  const [widgetContainer] = document.getElementsByTagName("main");
  articles.forEach((article) => {
    widgetContainer.appendChild(createItem(article));
  });
  // container.innerText = "Hello";
  // console.log(articles);
}

generateWidget();
