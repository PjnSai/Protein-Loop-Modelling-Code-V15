# logging_config.py - Application Logging System
import logging

# Configure basic logging with INFO level for application events
logging.basicConfig(level=logging.INFO)

# Create application logger instance used throughout the system
logger = logging.getLogger("loop_modeller")