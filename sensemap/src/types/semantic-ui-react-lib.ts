declare module 'semantic-ui-react/dist/commonjs/lib' {
  export function useKeyOnly(val: boolean | undefined, key: string): string | false;
  export function useValueAndKey(val: string | undefined, key: string): string | false;
}