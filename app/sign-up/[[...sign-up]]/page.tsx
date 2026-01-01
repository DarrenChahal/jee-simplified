import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <main className="flex justify-center items-center h-screen">
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </main>
    );
}
