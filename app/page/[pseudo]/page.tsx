/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { getUserInfo } from "@/app/server";
import { SocialLink } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = ({ params }: { params: Promise<{ pseudo: string }> }) => {
  const [pseudo, setPseudo] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [theme, setTheme] = useState<string | null | undefined>(null);

  const resolveParamsAndFetchData = async () => {
    try {
      const resolvedParams = await params;
      setPseudo(resolvedParams.pseudo);
      const userInfo = await getUserInfo(resolvedParams.pseudo);
      if (userInfo) {
        setTheme(userInfo?.theme);
        document.documentElement.setAttribute(
          "data-theme",
          userInfo.theme || "corporate"
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la récupération de cette page");
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveParamsAndFetchData();
  }, [params]);

  return <div></div>;
};

export default page;
