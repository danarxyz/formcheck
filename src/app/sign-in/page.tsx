import { Suspense } from "react";
import { copy } from "@/copy";
import { SignInButton } from "./sign-in-button";

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <section className="mx-auto flex max-w-sm flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{copy.auth.title}</h1>
      <p className="text-muted-foreground">{copy.auth.body}</p>
      <SignInButton />
      <Suspense>
        <Denied searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function Denied({ searchParams }: Pick<PageProps<"/sign-in">, "searchParams">) {
  const { denied, error } = await searchParams;
  if (!denied && !error) return null;
  return <p className="text-destructive text-sm">{copy.auth.denied}</p>;
}
