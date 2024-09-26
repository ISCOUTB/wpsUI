import Link from "next/link";
import { JSX, SVGProps } from "react";
import Image from "next/image";

export function Principal() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#1679AB]">
      <header className="flex h-20 items-center justify-between bg-[#CDE8E5] px-4 shadow-md lg:px-6">
        <Link
          href="/simulador"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <LeafIcon className="h-8 w-8" />
          <span className="sr-only">WSP Simulator</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/about"
            className="px-4 py-4 text-lg font-medium text-[#0E6D66] underline-offset-4 hover:underline"
            prefetch={false}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="px-4 py-4 text-lg font-medium text-[#0E6D66] underline-offset-4 hover:underline"
            prefetch={false}
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full bg-[#CDE8E5] py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-[#0E6D66] sm:text-5xl xl:text-6xl/none">
                    Unleash the Power of Multi-Agent Wireless Sensor Networks
                  </h1>
                  <p className="text-muted-foreground max-w-[600px] md:text-xl">
                    Our advanced WSP simulator empowers you to design, test, and
                    optimize your sensor network applications with ease. Explore
                    the dynamic interplay of multi-agent systems and sensor
                    nodes in a realistic virtual environment.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="../pages/simulador"
                    className="focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md bg-[#0E6D66] px-8 text-sm font-medium text-[#CDE8E5] shadow transition-colors hover:bg-[#0E6D66]/90 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Try the Simulator
                  </Link>
                </div>
              </div>
              <Image
                src="/images/Hero.jpg"
                alt="Hero Image"
                width={930}
                height={930}
                className="rounded-lg object-cover"
                quality={100}
              />
            </div>
          </div>
        </section>
        <section
          id="about"
          className="w-full bg-[#CDE8E5] py-12 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#0E6D66] px-3 py-2 text-lg text-[#CDE8E5]">
                  <Link href="/About"> About Us</Link>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-[#0E6D66] sm:text-5xl">
                  Discover the Power of Multi-Agent Wireless Sensor Networks
                </h2>
                <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our WSP simulator offers a comprehensive suite of tools to
                  design, simulate, and analyze your sensor network
                  applications. Leverage the power of multi-agent systems to
                  explore decentralized decision-making and emergent behaviors.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/images/AI.jpg"
                alt="AI Image"
                width={830}
                height={830}
                className="rounded-lg object-cover"
                quality={100}
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#0E6D66]">
                        Multi-Agent Simulation
                      </h3>
                      <p className="text-muted-foreground">
                        Explore the complex interactions between autonomous
                        agents and sensor nodes in a dynamic virtual
                        environment.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#0E6D66]">
                        Sensor Network Modeling
                      </h3>
                      <p className="text-muted-foreground">
                        Accurately model the behavior and performance of your
                        sensor network, including node placement, communication
                        protocols, and energy consumption.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold text-[#0E6D66]">
                        Visualization and Analytics
                      </h3>
                      <p className="text-muted-foreground">
                        Gain deep insights into your sensor network through
                        interactive visualizations and comprehensive data
                        analysis tools.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="w-full border-t bg-[#CDE8E5] py-12 md:py-24 lg:py-32"
        ></section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t bg-[#0E6D66] px-4 py-6 text-[#CDE8E5] sm:flex-row md:px-6">
        <p className="text-xs">
          &copy; 2024 WSP Simulator. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            href="#"
            className="text-xs underline-offset-4 hover:underline"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function LeafIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
