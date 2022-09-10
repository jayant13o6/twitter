import React from "react";
import axios from "axios";
import moment from "moment";
import LinearProgress from "@mui/material/LinearProgress";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState();
  const [filterData, setFilterData] = React.useState();
  const [date, setDate] = React.useState();
  const [spacing, setSpacing] = React.useState(2);
  const fav = localStorage.getItem("favs")
    ? JSON.parse(localStorage.getItem("favs"))
    : [];

  const handleInput = async (e) => {
    const inputTS = new Date(e.target.value).getTime();
    setDate(inputTS);
  };
  const filterAsPerDates = () => {
    if (date && data) {
      const result = data.filter((d) => Date.parse(d.publishedDate) <= date);
      setFilterData(result);
    }
  };
  const fetchData = async () => {
    try {
      const result = await axios.get(
        "http://www.mocky.io/v2/5d1ef97d310000552febe99d"
      );
      if (result.status === 200) {
        setLoading(false);
        setData(result.data);
        setFilterData(result.data);
      } else {
        console.error("fuge error");
      }
    } catch (error) {
      console.error("error in fetchData>>", error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  if (loading) {
    return <LinearProgress />;
  }
  return (
    <div style={{ margin: "10px", flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            style={{ marginRight: "2px" }}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            style={{ overflow: "unset", flexGrow: 1, display: "flex" }}
          >
            Welcome
          </Typography>
          <div
            style={{
              position: "relative",
              borderRadius: "5px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "end",
              "&:hover": {
                opacity: "0.25",
              },
            }}
          >
            <Button
              onClick={() => {
                filterAsPerDates();
              }}
            >
              <SearchIcon
                style={{
                  padding: "5px 5px",
                  height: "100%",
                  position: "absolute",
                  pointerEvents: "none",
                  alignItems: "center",
                  color: "black",
                }}
              />
            </Button>
            <InputBase
              placeholder="Search By Date..."
              style={{ marginLeft: "10px" }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => handleInput(e)}
            />
          </div>
        </Toolbar>
      </AppBar>

      <Grid container style={{ flexGrow: 1 }} spacing={2}>
        <Grid item sm={6}>
          <Grid container justifyContent="center" spacing={spacing}>
            {filterData?.map((ele) => (
              <Grid key={ele.id} item={true}>
                <NewsCard
                  key={ele.id}
                  text={ele.text}
                  author={ele.author}
                  image={ele.imageUrl}
                  url={ele.url}
                  publishedDate={ele.publishedDate}
                  likes={parseInt(ele.likes)}
                  fav={fav}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;

const NewsCard = (props) => {
  const { text, author, image, publishedDate, url, likes, fav } = props;

  React.useEffect(() => {
    if (localStorage.getItem("favs")) {
      localStorage.setItem("favs", JSON.stringify(fav));
      console.log("fav", fav);
    }
  }, [fav]);
  const saveTweet = (e) => {
    const newEle = e.currentTarget.value;
    fav.push(newEle);
    localStorage.setItem("favs", JSON.stringify(fav));
  };
  return (
    <Card style={{ maxWidth: "400px", margin: "10px 20px" }}>
      <CardHeader
        avatar={<Avatar aria-label="recipe">R</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={author}
        subheader={moment(publishedDate).format("MMMM Do YYYY hh:mm:ss")}
      />
      {image && (
        <CardMedia
          style={{
            height: "0px",
            paddingTop: "56.25%", // 16:9
          }}
          image={image}
          title={author}
        />
      )}
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          aria-label="add to favorites"
          value={url}
          onClick={(e) => saveTweet(e)}
        >
          <FavoriteIcon
            style={{ color: likes > 0 ? "red" : "grey", gap: "2px" }}
          />
          {likes > 0 && fav.includes(url) ? (
            <>{likes + 1}</>
          ) : likes > 0 && !fav.includes(url) ? (
            <>{likes + 1}</>
          ) : (
            likes === 0 && fav.includes(url) && <> 1 </>
          )}
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => window.location.replace(`${url}`)}
        >
          Original tweet
        </Button>
      </CardActions>
    </Card>
  );
};
