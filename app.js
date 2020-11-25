const express = require("express");
const yelp = require("yelp-fusion");
const cors = require('cors');

const client = yelp.client(
  "1ew9pCMq_7UrOW8uxArF_DsbdhTKm-4p9AY31ZRgscdAf70lp_9LHqVAEHl9wMffc_VSBUG66a7cxZDD-ghj76x0hr3na8pafKYmKhTXTx6eVbrK1-hXJG50jOW6X3Yx"
);

const app = express();
const port = 3000;
app.use(cors());

app.get("/businesses/search", (req, res) => {
    client
      .search({
        categories: "Restaurants",
        location: "Las Vegas",
      })
      .then((response) => {
        res.send(response.jsonBody.businesses);
      })
  });

  const handleError = (res) => {
    const handle = (error) => {
      if (null == error) {
        return handle({ message: `Error: ${error}` });
      }
  
      if ('object' === typeof error) {
        if ('message' in error && 'string' === typeof error.message) {
          if ('statusCode' in error && 'number' === typeof error.statusCode) {
            res.status(error.statusCode);
          } else {
            res.status(500);
          }
  
          return res.send({ message: error.message });
        }
  
        if (error.hasOwnProperty('toString')) {
          return handle(error.toString());
        }
      }
  
      if ('string' === typeof error) {
        return handle({ message: error });
      }
  
      return handle({ message: 'Unknown error' });
    };
  
    return handle;
  };


app.get("/businesses/:id", (req, res) => {
  client.business(req.params["id"]).then((response) => {
    res.send(response.jsonBody);
  }).catch(handleError(res));
});

app.get("/businesses/:id/reviews", (req, res) => {
  client.reviews(req.params["id"]).then((response) => {
      res.send(response.jsonBody)
  });
});



app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
