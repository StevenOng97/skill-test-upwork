"use client";

import { RedocStandalone } from 'redoc';

export default function Documents() {
  return (
    <div className="mt-[69px]">
      <RedocStandalone
        specUrl={`${process.env.NEXT_PUBLIC_API_URL}/openapi.json`}
        options={{
          nativeScrollbars: true,
          theme,
          hideLoading: true,
          disableSearch: true,
        }}
      />
    </div>
  );
}

const theme = { colors: { primary: { main: '#000000' } } }
