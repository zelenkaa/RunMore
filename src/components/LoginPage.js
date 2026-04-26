// App.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function LoginPage() {
  
  return (
    <div>
      <form action="/.auth/login/aad">
        <button type="submit">Login with Azure AD</button>
      </form>
    </div>
  );
}