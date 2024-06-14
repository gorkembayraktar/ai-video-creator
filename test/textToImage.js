import fs from 'fs'

const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer sk-6bjD14eKkemUIWi29T6uVuRbRrMoGdzHTyuo1cGbC6ANRtNM");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "steps": 40,
  "width": 1344,
  "height": 768,
  "seed": 0,
  "cfg_scale": 7,
  "samples": 1,
  "text_prompts": [
    {
      "text": "Once upon a time, in a distant forest, there was a place where animals could talk and magical things happened.",
      "weight": 1
    }
  ]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    fs.writeFile("out.png", result.artifacts[0].base64, 'base64', function(err) {
        console.log(err);
    });

  })
  .catch((error) => console.error(error));