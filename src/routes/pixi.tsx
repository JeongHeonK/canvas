import { createFileRoute } from "@tanstack/react-router";
import { Application, Container, Assets, Sprite } from "pixi.js";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/pixi")({
  component: RouteComponent,
});

function RouteComponent() {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    let app: Application;

    (async () => {
      app = new Application();
      await app.init({ background: "#1099bb", resizeTo: window });

      if (!divRef.current) return;
      divRef.current.appendChild(app.canvas);

      const container = new Container();
      app.stage.addChild(container);

      const texture = await Assets.load("https://pixijs.com/assets/bunny.png");

      const bunny = new Sprite(texture);
      bunny.x = app.screen.width / 2;
      bunny.y = app.screen.height / 2;
      bunny.scale.set(2);
      container.addChild(bunny);

      bunny.pivot.set(bunny.width / 2, bunny.height / 2);

      app.ticker.add((time) => {
        bunny.rotation -= 0.01 * time.deltaTime;
      });

      app.canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        const scaleAmount = 1.1;
        const mouse = {
          x: e.offsetX,
          y: e.offsetY,
        };

        // 현재 스케일
        const oldScale = app.stage.scale.x;
        const direction = e.deltaY < 0 ? 1 : -1;
        const newScale =
          direction > 0 ? oldScale * scaleAmount : oldScale / scaleAmount;

        // 마우스 위치 기준으로 좌표 변환
        const worldPos = {
          x: (mouse.x - app.stage.x) / oldScale,
          y: (mouse.y - app.stage.y) / oldScale,
        };

        // 스테이지 스케일 변경
        app.stage.scale.set(newScale);

        // 새로운 위치 계산
        const newScreenPos = {
          x: worldPos.x * newScale + app.stage.x,
          y: worldPos.y * newScale + app.stage.y,
        };

        // 스테이지 위치 조정 → 줌 중심 유지
        app.stage.x -= newScreenPos.x - mouse.x;
        app.stage.y -= newScreenPos.y - mouse.y;
      });
    })();
  }, []);

  return <div className="w-full h-screen bg-gray-50" ref={divRef}></div>;
}
