"use client";

import { Ref, useCallback, useRef, useState } from "react";
import { Box, Button, Container, Heading, SimpleGrid, Skeleton, Text, VStack } from "@chakra-ui/react";
import { event } from "nextjs-google-analytics";

import { BildvalRound, GAMES, IKEAProduct, PageProps } from "@/interfaces";
import { useBildval } from "@/hooks/useBildval";
import { BildvalGuessOption, BildvalGuessOptionSkeleton } from "@/components/bildval";
import { BILDVAL } from "@/utils/constants";
import { useTranslation } from "@/app/i18n/client";
import { useEffectTimeout } from "@/hooks/useEffectTimeout";

function BildvalGameUnlimited({ params: { lang } }: PageProps) {
  // Translations
  const { t } = useTranslation(lang);
  const { t: b } = useTranslation(lang, GAMES.BILDVAL);

  // Refs
  const nextButtonRef = useRef<HTMLButtonElement>();

  // Game state
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Bildval round
  const [bildvalRound, setBildvalRound] = useState<BildvalRound>();

  const { getBildvalRound } = useBildval({});

  const getBildvalWords = useCallback(async () => {
    // Fetch new bildval round
    setBildvalRound(getBildvalRound());

    // Unfocus next button
    nextButtonRef.current?.blur();

    // Track round event
    event(BILDVAL.ROUND_EVENT, { category: "unlimited" });

    setShowSolution(false);
  }, [getBildvalRound]);

  // Get a new word on load
  useEffectTimeout(
    () => {
      getBildvalWords();
    },
    [getBildvalWords],
    1000,
  );

  const onPass = () => {
    getBildvalWords();
  };

  // Match the selected option with the solution
  const onMatch = (item: IKEAProduct) => {
    if (!bildvalRound) return;

    // Highlight correct option on round end
    setShowSolution(true);

    // Focus next button after delay
    setTimeout(() => {
      nextButtonRef.current?.focus();
    }, 100);
  };

  return (
    <Container maxW="container.lg" px="0">
      <VStack alignItems="stretch" spacing={{ base: 6, md: 8 }}>
        <Heading textAlign="center" textTransform="capitalize" fontSize={{ base: "xl", md: "2xl" }}>
          {b("title_difficulty", { difficulty: "∞" })}
        </Heading>

        {/* Active game */}
        {(bildvalRound && (
          <VStack alignItems="stretch" spacing={{ base: 6, md: 8 }}>
            <Box px="6" py={{ base: 2, md: 4 }} bg="gray.50">
              <Text textAlign="center" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="semibold">
                {b("question", { product: bildvalRound.solution.name })}
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 4, md: 8 }}>
              {bildvalRound.guesses.map((guess) => (
                <BildvalGuessOption
                  key={guess.name}
                  guess={guess}
                  solution={bildvalRound.solution}
                  showSolution={showSolution}
                  onClick={() => onMatch(guess)}
                />
              ))}
            </SimpleGrid>
          </VStack>
        )) || (
          <VStack alignItems="stretch" spacing={{ base: 6, md: 8 }}>
            <Skeleton h="84px" />

            <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 4, md: 8 }}>
              <BildvalGuessOptionSkeleton />
              <BildvalGuessOptionSkeleton />
              <BildvalGuessOptionSkeleton />
              <BildvalGuessOptionSkeleton />
            </SimpleGrid>
          </VStack>
        )}

        {/* Skip */}
        <Button
          ref={nextButtonRef as Ref<HTMLButtonElement>}
          variant="outline"
          alignSelf="center"
          onClick={onPass}
          isLoading={!bildvalRound}
          loadingText={t("pass")}
        >
          {showSolution ? t("next") : t("pass")}
        </Button>
      </VStack>
    </Container>
  );
}

export default BildvalGameUnlimited;
