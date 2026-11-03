import { Stack, Typography, useTheme } from "@mui/material";
import {
  isBookSearchResult,
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
        width: { xs: "100%", md: "80%" },
        height: { xs: "20em", md: "25em" },
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
            objectPosition: "center",
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
  category?: Category;
  onClick?: (category: Category) => void;
}

export const SearchCard = ({
  cardData,
  mode = "result",
  resultNumber,
  category,
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
      return cardData.releaseDate ? cardData.releaseDate.split("-")[0] : "";
    }
    return cardData?.releaseDate.split("-")[0];
  };
  const date = releaseDate();
  const getImg = () => {
    if (isGameSearchResult(cardData)) {
      return cardData.image;
    }
    if (isBookSearchResult(cardData)) {
      return cardData.image;
    }
    return cardData?.posterUrl;
  };

  return (
    <MotionStack
      className="search-card"
      direction="row"
      whileHover={{
        y: -3,
        boxShadow: `0 8px 24px ${theme.palette.action.hover}`,
        transition: {
          duration: 0.2,
          type: "spring",
          stiffness: 300,
        },
      }}
      sx={{
        width: { xs: "100%" },
        minHeight:
          mode === "category"
            ? { xs: 84, sm: 96 }
            : { xs: 112, sm: 128 },
        position: "relative",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: mode === "category" ? "space-between" : "flex-start",
        gap: { xs: 1.5 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        bgcolor: "background.paper",
        color: "text.primary",
        cursor: mode === "category" ? "pointer" : "default",
        transition: "border-color 160ms ease",
        "&:hover": {
          borderColor: mode === "category" ? "text.secondary" : "divider",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "secondary.main",
          outlineOffset: 2,
        },
      }}
      role={mode === "category" ? "button" : undefined}
      tabIndex={mode === "category" ? 0 : undefined}
      onClick={() => category && onClick?.(category)}
      onKeyDown={(event) => {
        if (mode === "category" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          if (category) onClick?.(category);
        }
      }}
    >
      {mode === "result" && cardData && (
        <>
          {/* image */}
          <MotionBox
            sx={{
              width: { xs: "36%", sm: "38%" },
              height: "100%",
              alignSelf: "stretch",
              flexShrink: 0,
            }}
          >
            <img
              src={getImg() ?? placeholder}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            ></img>
          </MotionBox>

          {/* details */}
          <MotionStack
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: "100%",
              alignItems: "flex-start",
              justifyContent: "space-between",
              px: { xs: 1.25, sm: 1.75 },
              py: { xs: 1.25, sm: 1.5 },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                overflowWrap: "anywhere",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {title()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <em>{date}</em>
            </Typography>
          </MotionStack>
        </>
      )}
      {mode === "category" && (
        <Stack
          direction="row"
          sx={{
            width: "100%",
            px: { xs: 2, sm: 2.5 },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, textTransform: "capitalize" }}
          >
            {category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resultNumber ?? 0} {resultNumber === 1 ? "result" : "results"}
          </Typography>
        </Stack>
      )}
    </MotionStack>
  );
};
