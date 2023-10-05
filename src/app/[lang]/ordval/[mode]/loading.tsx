"use client";

import { SimpleGrid, Skeleton } from "@chakra-ui/react";

import { OrdvalGuessOptionSkeleton } from "@/components/ordval";
import { PADDING } from "@/theme";
import { GameContainer } from "@/components/gameContainer";

export default function Loading() {
  return (
    <GameContainer pt="109px">
      <Skeleton h="84px" mt="8" />

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={PADDING.DEFAULT}>
        <OrdvalGuessOptionSkeleton />
        <OrdvalGuessOptionSkeleton />
        <OrdvalGuessOptionSkeleton />
        <OrdvalGuessOptionSkeleton />
      </SimpleGrid>
    </GameContainer>
  );
}

