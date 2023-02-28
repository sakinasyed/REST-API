const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
//stores our static files like images, css code
app.use(express.static("public"));

mongoose.set("strictQuery", true);
try {
  mongoose.connect(
    "mongodb://127.0.0.1:27017/wikiDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected")
  );
} catch (e) {
  console.log(e);
}

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("articles", articleSchema);

//Chained Route Handler
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        console.log(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////particular article/////////////////
app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found ");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("successfully updated Article");
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    ),
      function (err) {
        if (!err) {
          res.send("successfully updated Article");
        } else {
          res.send(err);
        }
      };
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("successfully deleted Article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(9000, function () {
  console.log("This server is running on port 9000");
});
