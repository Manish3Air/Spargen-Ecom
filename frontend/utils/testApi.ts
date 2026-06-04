import BASE_URL from "@/utils/api";

/**
 * Test the API connection and analytics endpoint
 * Open browser console and run: testDashboardApi()
 */
export const testDashboardApi = async () => {
  try {
    console.log("🔍 Testing Dashboard API Connection...");
    console.log(`📍 API Base URL: ${BASE_URL}`);

    const token = localStorage.getItem("authToken");
    console.log(`🔐 Auth Token: ${token ? "✅ Present" : "❌ Missing"}`);

    if (!token) {
      console.warn("⚠️  No auth token found. You may need to login first.");
      return;
    }

    const url = `${BASE_URL}/api/analytics`;
    console.log(`🌐 Requesting: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log("📦 Response Data:", data);

    if (response.ok) {
      console.log("✅ API Connection Successful!");
      console.log(`   - Total Users: ${data.totalUsers}`);
      console.log(`   - Total Products: ${data.totalProducts}`);
      console.log(`   - Total Orders: ${data.totalOrders}`);
      console.log(`   - Total Revenue: ₹${data.totalRevenue}`);
      return data;
    } else {
      console.error("❌ API Error:", data);
      return null;
    }
  } catch (error: any) {
    console.error("❌ Connection Error:", error.message);
    console.error("Full Error:", error);
    return null;
  }
};

/**
 * Test backend health
 */
export const testBackendHealth = async () => {
  try {
    console.log("🏥 Testing Backend Health...");
    const url = `${BASE_URL}/health`;
    const response = await fetch(url);
    const data = await response.text();
    console.log(`✅ Backend Health: ${data}`);
    return response.ok;
  } catch (error: any) {
    console.error("❌ Backend is not reachable:", error.message);
    return false;
  }
};

/**
 * Check authentication
 */
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("❌ No auth token found");
      return false;
    }

    console.log("🔐 Checking Authentication...");
    console.log(`Token: ${token.substring(0, 20)}...`);
    return true;
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return false;
  }
};

/**
 * Full diagnosis
 */
export const runFullDiagnosis = async () => {
  console.log("\n=== 🔧 FULL DASHBOARD DIAGNOSIS ===\n");

  const backendOk = await testBackendHealth();
  const authOk = await checkAuth();

  if (backendOk && authOk) {
    const data = await testDashboardApi();
    if (data) {
      console.log("\n✅ Everything looks good!");
    }
  } else {
    console.log("\n❌ Issues detected. Check logs above.");
  }

  console.log("\n=== 📋 DEBUGGING CHECKLIST ===");
  console.log("1. Is the backend running? (npm run dev in backend folder)");
  console.log("2. Are you logged in? (Token present in localStorage)");
  console.log("3. Is the database connected? (Check backend console)");
  console.log("4. Does the database have data? (Check MongoDB)");
  console.log("5. Are CORS settings correct?");
  console.log("\n");
};

// Make functions available globally for quick testing
if (typeof window !== "undefined") {
  (window as any).testDashboardApi = testDashboardApi;
  (window as any).testBackendHealth = testBackendHealth;
  (window as any).checkAuth = checkAuth;
  (window as any).runFullDiagnosis = runFullDiagnosis;
}
