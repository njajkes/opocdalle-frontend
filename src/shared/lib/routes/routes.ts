type RouteObject =
  | {
      path: string;
      children?: RouteObject[];
    }
  | { index: true };

// used from ts-essetials, prettify intersection types in IDE
type Prettify<Type> = Extract<{ [Key in keyof Type]: Type[Key] }, Type>;

type TruncatePath<Path extends string> = Path extends `/${infer Payload}`
  ? Payload
  : Path;

type IterateExtractPath<
  Path extends string,
  // Using {} bc it's accamulated object
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Acc extends { [key: string]: string } = {}
> = TruncatePath<Path> extends `:${infer CurrentPath}/${infer RestPath}`
  ? IterateExtractPath<RestPath, Acc & { [key in CurrentPath]: string }>
  : TruncatePath<Path> extends ""
  ? Prettify<Acc>
  : Path extends `${string}/${infer RestPath}`
  ? IterateExtractPath<RestPath, Acc>
  : TruncatePath<Path> extends `:${infer CurrentPath}`
  ? Prettify<Acc & { [key in CurrentPath]: string }>
  : never;

type PathParams<Path extends string> = Path extends `${string}:${string}`
  ? IterateExtractPath<Path>
  : void;

// w/o this guard, all pathes will be started with ///
type SlashGuard<PathA extends string, PathB extends string> = PathA extends "/"
  ? `${PathA}${PathB}`
  : PathB extends "/"
  ? `${PathA}${PathB}`
  : `${PathA}/${PathB}`;

type MapRouteNodeToPath<
  Route extends RouteObject,
  Path extends string,
  Acc extends string[] = []
> = Route extends { index: true }
  ? [...Acc, Path]
  : Route extends { path: `${infer IncomingPath}` }
  ? Route extends { children: RouteObject[] }
    ? MapRouteNodesToPathes<
        Route["children"],
        SlashGuard<Path, IncomingPath>,
        Acc
      >
    : [...Acc, SlashGuard<Path, IncomingPath>]
  : Acc;

type MapRouteNodesToPathes<
  Routes extends RouteObject[],
  Path extends string = "",
  AccRoutes extends string[] = []
> = Routes extends [
  infer First extends RouteObject,
  ...infer Rest extends RouteObject[]
]
  ? Rest["length"] extends 0
    ? [...AccRoutes, ...MapRouteNodeToPath<First, Path, AccRoutes>]
    : [
        ...AccRoutes,
        ...MapRouteNodeToPath<First, Path, AccRoutes>,
        ...MapRouteNodesToPathes<Rest, Path, AccRoutes>
      ]
  : AccRoutes;

type Tree = [
  {
    path: "/";
    children: [
      { index: true; },
      {
        path: "courses";
        children: [
          { index: true; },
          { path: ":id"; }
        ];
      }
    ];
  }
];

export type ModifyTreeNodes<
  T extends RouteObject[],
  Modifier extends Record<string, unknown>,
  AccResult extends (RouteObject & Modifier)[] = []
> = T extends [
  infer First extends RouteObject,
  ...infer Rest extends RouteObject[]
]
  ? Rest["length"] extends 0
    ? First extends { children: RouteObject[] }
      ? [
          ...AccResult,
          (First & {
            children: ModifyTreeNodes<First["children"], Modifier>;
          }) &
            Modifier
        ]
      : [...AccResult, First & Modifier]
    : First extends { children: RouteObject[] }
    ? ModifyTreeNodes<
        Rest,
        Modifier,
        [
          ...AccResult,
          (First & {
            children: ModifyTreeNodes<First["children"], Modifier>;
          }) &
            Modifier
        ]
      >
    : ModifyTreeNodes<Rest, Modifier, [...AccResult, First & Modifier]>
  : AccResult;

export type RoutesTree<Modifiers extends Record<string | number | symbol, unknown>> = ModifyTreeNodes<Tree, Modifiers>;

export type Routes = MapRouteNodesToPathes<Tree>[number];

const isTokenInParams = <T extends Routes>(
  token: string | number | symbol,
  params: IterateExtractPath<T>
): token is keyof IterateExtractPath<T> => {
  return !!params && token in params;
};

class RouterLinkBuilder<T extends Routes> {
  constructor(private path: T) {}

  public toLink(params: PathParams<T>): string {
    const tokens = this.path.split("/").filter(Boolean);
    return (
      tokens.reduce((acc, token) => {
        if (token.startsWith(":") && params) {
          token = token.slice(1);

          if (isTokenInParams(token, params)) {
            return acc + "/" + params[token];
          }

          throw new TypeError(`Missing param "${token}"`);
        }
        return acc + "/" + token;
      }, "") + "/"
    );
  }
}

export const createInternalRouter = () => {
  return {
    path<T extends Routes>(path: T) {
      return new RouterLinkBuilder<T>(path);
    },
  };
};
