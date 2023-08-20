"use client";

import { useEffect } from "react";
import { Center, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { JUMBLE } from "@/utils/paths";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(JUMBLE);
  }, [router]);

  return (
    <main>
      <Center h="100vh">
        <Heading textAlign="center">IKEA Word Games</Heading>
      </Center>
    </main>
  );
}
