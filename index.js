let userCountry;
//Use IP address to determine where the user is located
async function getCountry() {
  const response = await fetch("https://ipapi.co/8.8.8.8/json/");
  try {
    if (response.ok) {
      const data = await response.json();
      userCountry = data.country;
    }
  } catch (error) {
    console.log(error);
  }
}
getCountry();

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
  item.className = "taboola-article";
  return item;
}

function createItemAnchor(itemObj) {
  const anchor = document.createElement("a");
  anchor.href = itemObj.url;
  anchor.className = "taboola-anchor";
  anchor.appendChild(createImage(itemObj));
  anchor.appendChild(createName(itemObj));
  anchor.appendChild(createBranding(itemObj));
  return anchor;
}

function createImage(itemObj) {
  const image = document.createElement("img");
  image.className = "taboola-image";
  image.src = itemObj.thumbnail[0].url;
  image.alt = itemObj.description || itemObj.name;
  return image;
}

function createName(itemObj) {
  const name = document.createElement("strong");
  name.className = "taboola-name";
  name.innerText = itemObj.name;
  return name;
}

function createBranding(itemObj) {
  const brand = document.createElement("p");
  brand.className = "taboola-brand";
  if (itemObj.categories && itemObj.categories.length > 0) {
    brand.innerText = `${itemObj.categories[0]} | ${itemObj.branding}`;
  } else {
    brand.innerText = itemObj.branding;
  }
  return brand;
}

function createDiv(className, innerText = "") {
  const div = document.createElement("div");
  div.className = className;
  div.innerText = innerText;
  return div;
}

function createAnchor(className, href, innerText = "") {
  const anchor = document.createElement("a");
  anchor.className = className;
  anchor.href = href;
  anchor.innerText = innerText;
  return anchor;
}

function createImg(className, imageURL) {
  const image = document.createElement("img");
  image.className = className;
  image.src = imageURL;
  return image;
}

async function generateWidget() {
  const articles = await getData();

  const mainDiv = createDiv("taboola-main-div");
  const headerDiv = mainDiv.appendChild(createDiv("taboola-header-sponsor"));

  //if user is located in the USA then Header will be displayed in English, if not then Spanish
  if (userCountry === "US") {
    headerDiv.appendChild(createDiv("you-may-like", "Articles You May Like"));
  } else {
    headerDiv.appendChild(
      createDiv("you-may-like", "Articulos Que Te Pueden Gustar")
    );
  }

  const taboolaAnchor = headerDiv.appendChild(
    createAnchor(
      "taboola-sponsor-anchor",
      "https://taboola.com",
      "sponsored links by"
    )
  );

  taboolaAnchor.appendChild(
    createImg(
      "taboola-logo",
      "https://www.taboola.com/wp-content/uploads/2021/11/taboola_logo_dark_blue-2.png"
    )
  );

  const articlesContainer = mainDiv.appendChild(
    createDiv("taboola-article-container")
  );

  const [widgetContainer] = document.getElementsByTagName("main");
  articles.forEach((article) => {
    articlesContainer.appendChild(createItem(article));
  });

  widgetContainer.appendChild(mainDiv);
}

generateWidget();
