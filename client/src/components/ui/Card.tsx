import { Typography } from "@mui/material";
import type { Book, Film, Game } from "../../assets/lib/types";
import { MotionBox, MotionStack } from "../motioncomps";
import placeholder from "/img/logo-alt.png";
interface CardProps {
  category: "movie" | "tv" | "book" | "game";
  cardData: Film | Book | Game;
}

export const DiscoveryCard = (props: CardProps) => {
  const getImg = () => {
    if (
      props.cardData.category === "movie" ||
      props.cardData.category === "tv"
    ) {
      return props.cardData.posterUrl;
    }
    if (props.cardData.category === "book") {
      if (Array.isArray(props.cardData.images)) {
        return props.cardData.images[0];
      }
      if (
        typeof props.cardData.images === "object" &&
        props.cardData.images !== null &&
        !Array.isArray(props.cardData.images)
      ) {
        const thumbnail = props.cardData.images.thumbnail;
        return thumbnail;
      }
      if (typeof props.cardData.images === "string") {
        return props.cardData.images;
      }
      return placeholder;
    }
    if (props.cardData.category === "game") {
      return props.cardData.image;
    }
  };
  const getTitle = () => {
    if (
      props.cardData.category === "movie" ||
      props.cardData.category === "tv"
    ) {
      return {
        title: props.cardData.title,
        release: props.cardData.releaseDate,
      };
    }
    if (props.cardData.category === "book") {
      return {
        title: props.cardData.title,
        release: props.cardData.publishDate,
      };
    }
    if (props.cardData.category === "game") {
      return {
        title: props.cardData.name,
        release: props.cardData.releaseDate,
      };
    }
  };

  const title = getTitle();

  return (
    <MotionStack
      sx={{
        width: "100%",
        height: { xs: 320, sm: 270 },
        backgroundColor: "background.paper",
        borderRadius: 2.25,
        overflow: "hidden",
      }}
    >
      {/* img - 75% */}
      <MotionBox sx={{ width: "100%", height: "70%" }}>
        <img src={getImg()} style={{ width: "100%", height: "100%" }}></img>
      </MotionBox>
      {/* details - 20% - name, release year, ratings?*/}
      <MotionStack
        spacing={{ xs: 1.5 }}
        sx={{
          width: "100%",
          alignItems: "start",
          color: "text.primary",
          flex: 1,
          pl: { xs: 1.2 },
          justifyContent: "space-between",
          py: { xs: 1.5 },
        }}
      >
        <Typography sx={{ fontSize: { xs: "0.8em" } }}>
          {title?.title}
        </Typography>
        <Typography sx={{ fontSize: { xs: "0.8em" } }}>
          <em>{title?.release}</em>
        </Typography>
      </MotionStack>
    </MotionStack>
  );
};
