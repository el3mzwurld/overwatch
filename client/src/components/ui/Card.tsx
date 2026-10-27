import { Divider, Typography, useTheme } from "@mui/material";
import {
  isBookSearchResult,
  isFilm,
  isGameSearchResult,
  type Book,
  type BookSearchResult,
  type Film,
  type Game,
  type GameSearchResult,
} from "../../assets/lib/types";
import { MotionBox, MotionStack } from "../motioncomps";
import placeholder from "/img/logo-alt.png";
import type { Category } from "./InfiniteGrid";
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
      initial={{
        opacity: 0,
        y: 10,
      }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      sx={{
        width: "100%",
        height: { xs: "20rem" },
        backgroundColor: "background.paper",
        borderRadius: 2.25,
        overflow: "hidden",
      }}
    >
      {/* img - 75% */}
      <MotionBox sx={{ width: "100%", height: "70%" }}>
        <img
          src={getImg()}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        ></img>
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

interface SearchCardProps {
  cardData?: Film | BookSearchResult | GameSearchResult;
  mode: "category" | "result";
  resultNumber?: number;
  caegory?: string;
  onClick?: (category: Category) => void;
}

export const SearchCard = ({
  cardData,
  mode = "result",
  resultNumber,
  caegory,
  onClick,
}: SearchCardProps) => {
  const theme = useTheme();
  const title = () => {
    if (isGameSearchResult(cardData)) {
      return cardData.name;
    }
    if (isBookSearchResult(cardData)) {
      return cardData.title;
    }
    return cardData?.title;
  };
  const releaseDate = () => {
    if (isBookSearchResult(cardData)) {
      return cardData.publishDate;
    }
    if (isGameSearchResult(cardData)) {
      return cardData.releaseDate;
    }
    return cardData?.releaseDate;
  };

  const date = releaseDate()?.split("-")[0];
  const getImg = () => {
    if (isGameSearchResult(cardData)) {
      return cardData.image;
    }
    if (isBookSearchResult(cardData)) {
      return cardData.image;
    }
    return cardData?.posterUrl;
  };

  console.log(getImg());
  return (
    <MotionStack
      className="search-card"
      direction={{ xs: "row" }}
      whileHover={{
        backgroundColor: theme.palette.secondary.main,
        scale: [null, 1.1, 1.2],

        transition: {
          duration: 0.4,
          type: "spring",
          stiffness: 100,
          ease: "easeIn",
        },
      }}
      initial={{
        opacity: 0,
        scale: 0.7,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 1,
        type: mode === "category" ? "tween" : "spring",
        ease: "easeIn",
      }}
      viewport={{ once: true, amount: 0.4 }}
      sx={{
        width: { xs: "100%" },
        height: { xs: mode === "category" ? "5rem" : "6.5rem" },
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "space-between",
        gap: { xs: 0.8 },
        border: "1px solid gray",
      }}
      onClick={() => onClick && onClick(caegory as Category)}
    >
      {mode === "result" && cardData && (
        <>
          {/* image */}
          <MotionBox sx={{ width: { xs: "40%" }, height: { xs: "100%" } }}>
            <img
              src={getImg() ?? placeholder}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            ></img>
          </MotionBox>

          {/* details */}
          <MotionStack
            sx={{
              flex: 1,
              height: { xs: "100%" },
              alignItems: { xs: "end" },
              justifyContent: "space-between",
              px: { xs: 1.5 },
              py: { xs: 1.5 },
              maxWidth: { xs: "55%" },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                textWrap: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                textAlign: "right",
              }}
            >
              {title()}
            </Typography>
            <Typography variant="caption">
              <em>{date}</em>
            </Typography>
          </MotionStack>
        </>
      )}
      {mode === "category" && (
        <>
          <Typography variant="body2" sx={{ px: { xs: 2 } }}>
            {resultNumber ?? 0} Results found in {caegory}
          </Typography>
          <Divider sx={{ mt: "auto" }} />
        </>
      )}
    </MotionStack>
  );
};
