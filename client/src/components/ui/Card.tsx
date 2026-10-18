import { MotionStack } from "../motioncomps";
import type { Category } from "./InfiniteGrid";

interface CardProps {
  name: string;
  release: string;
}
export const DiscoveryCard = () => {
  return (
    <MotionStack
      sx={{
        width: "100%",
        height: { xs: 250, sm: 270 },
        backgroundColor: "background.paper",
        borderRadius: 2.25,
      }}
    >
      {/* img - 75% */}

      {/* details - 20% - name, release year, ratings?*/}
    </MotionStack>
  );
};
