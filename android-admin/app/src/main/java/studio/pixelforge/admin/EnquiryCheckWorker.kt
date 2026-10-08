package studio.pixelforge.admin

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL

class EnquiryCheckWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

    private val channelId = "pixelforge_enquiry_alerts"
    private val prefs = context.getSharedPreferences("pixelforge_worker_prefs", Context.MODE_PRIVATE)

    override suspend fun doWork(): Result {
        return try {
            val url = URL("https://pxfgsd.vercel.app/api/enquiries")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            conn.connectTimeout = 10000
            conn.readTimeout = 10000

            if (conn.responseCode == 200) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()

                val jsonArray = JSONArray(response.toString())
                val lastKnownId = prefs.getString("last_known_enquiry_id", "")

                if (jsonArray.length() > 0) {
                    val newest = jsonArray.getJSONObject(0)
                    val newestId = newest.optString("id", "")
                    val status = newest.optString("status", "")
                    val name = newest.optString("name", "Client")
                    val service = newest.optString("service", "Project")
                    val budget = newest.optString("budget", "")

                    if (newestId.isNotEmpty() && newestId != lastKnownId && (status == "PENDING" || status == "NEW")) {
                        // Store newest id
                        prefs.edit().putString("last_known_enquiry_id", newestId).apply()

                        // Trigger native system notification
                        sendNotification(
                            "🔔 New Enquiry: $name",
                            "$service • $budget"
                        )
                    } else if (newestId.isNotEmpty() && lastKnownId.isNullOrEmpty()) {
                        // First run save baseline
                        prefs.edit().putString("last_known_enquiry_id", newestId).apply()
                    }
                }
            }
            conn.disconnect()
            Result.success()
        } catch (e: Exception) {
            e.printStackTrace()
            Result.retry()
        }
    }

    private fun sendNotification(title: String, message: String) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            101,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setSound(soundUri)
            .setVibrate(longArrayOf(0, 400, 200, 400))
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(1001, builder.build())
    }
}
