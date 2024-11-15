terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.69.1"
    }
  }
}

provider "google" {
  credentials = file("./credentials.json")
  project     = "cloud-assignment-3-389918"
  region      = "us-east1"
}

resource "google_container_cluster" "primary" {
  name                     = "cloud-assignment-3-terraform-2"
  location                 = "us-east1"
  network                  = "default"
  remove_default_node_pool = true
  initial_node_count       = 1
}

resource "google_container_node_pool" "primary_nodes" {
  depends_on = [google_container_cluster.primary]
  name       = "cloud-assignment-3-terraform-node-pool-2"
  location   = "us-east1"
  cluster    = "cloud-assignment-3-terraform-2"
  # node_count         = 1
  initial_node_count = 1

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    disk_size_gb = 10
    disk_type    = "pd-standard"
    image_type   = "COS_CONTAINERD"
    machine_type = "e2-micro"
  }
}
