import { createFileRoute } from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/Gsap")({
  component: Gsap,
});

const timeline = gsap.timeline({ repeat: 100, yoyo: true, repeatDelay: 1 });

function Gsap() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scrollRef.current) return;

      const boxes = gsap.utils.toArray<HTMLElement>(scrollRef.current.children);

      boxes.forEach((box) => {
        gsap.to(box, {
          x: 100 * (boxes.indexOf(box) + 1),
          scale: 2,
          rotation: 180,
          duration: 3,
          ease: "power1.inOut",
          scrollTrigger: {
            scroller: scrollRef.current,
            trigger: box,
            start: "bottom bottom",
            end: "top 20%",
            scrub: true,
          },
        });
      });
    },
    { scope: scrollRef }
  );

  useGSAP(() => {
    gsap.to("#test-box1", {
      x: 250,
      repeat: 100,
      yoyo: true,
      rotation: 180,
      duration: 3,
      ease: "power1.inOut",
    });
  }, []);

  useGSAP(() => {
    gsap.from("#test-box2", {
      x: 250,
      repeat: 100,
      yoyo: true,
      rotation: 180,
      duration: 6,
      ease: "power1.inOut",
    });
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      "#test-box3",
      {
        x: 100,
        repeat: 100,
      },
      {
        x: 600,
        repeat: 100,
        yoyo: true,
        borderRadius: "100%",
        rotation: 360,
        duration: 4,
        ease: "bounce.out",
      }
    );
  }, []);

  useGSAP(() => {
    timeline.to("#test-box4", {
      x: 250,
      rotation: 180,
      duration: 2,
      ease: "power1.inOut",
    });

    timeline.to("#test-box4", {
      x: 500,
      scale: 1,
      rotation: 360,
      borderRadius: "50%",
      duration: 2,
      ease: "power1.inOut",
    });
  }, []);

  useGSAP(() => {
    gsap.to(".stagger", {
      y: 250,
      duration: 2,
      repeat: 100,
      yoyo: true,
      ease: "power1.inOut",
      stagger: {
        amount: 1,
        ease: "power1.inOut",
        from: "center",
      },
    });
  }, []);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <main>
      <p>Hello "/gsap"!</p>
      <button
        className="px-4 py-2 border rounded-lg ml-20"
        onClick={() => {
          console.log(timeline.paused());
          if (timeline.paused()) {
            timeline.play();
            setIsPlaying(true);
          } else {
            timeline.pause();
            setIsPlaying(false);
          }
        }}
      >
        {isPlaying ? "pause" : "play"}
      </button>
      <div className="m-20 mt-10 h-[calc(100vh-20rem)] border border-gray-300 flex flex-col gap-4">
        <div id="test-box1" className="size-20 bg-red-500 rounded-lg"></div>
        <div id="test-box2" className="size-20 bg-green-500 rounded-lg"></div>
        <div id="test-box3" className="size-20 bg-blue-500 rounded-lg"></div>
        <div id="test-box4" className="size-20 bg-yellow-500 rounded-lg"></div>
        <div className="flex gap-2 ml-10">
          <div className="w-10 h-20 bg-slate-100 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-200 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-300 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-400 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-500 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-600 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-700 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-800 rounded-lg stagger" />
          <div className="w-10 h-20 bg-slate-900 rounded-lg stagger" />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="h-[500px] border border-gray-300 m-20 mt-10 overflow-y-scroll overflow-x-hidden"
      >
        <div className="h-[600px] w-full"></div>
        <div className="w-20 h-20 bg-red-500 rounded-full"></div>
        <div className="w-20 h-20 bg-pink-500 rounded-full"></div>
        <div className="h-[600px] w-full"></div>
      </div>
    </main>
  );
}
